import { FormValidate } from '@shared/util';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { ListarAsignacionGestionDiariaConfig } from './listar-asignacion-gestion-diaria.config';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-listar-asignacion-gestion-diaria',
  templateUrl: './listar-asignacion-gestion-diaria.component.html'
})
export class ListarAsignacionGestionDiariaComponent extends FormValidate implements OnInit, OnDestroy {
  configuracion: ListarAsignacionGestionDiariaConfig = new ListarAsignacionGestionDiariaConfig();
  usuarios: any[];
  tipoEventos: any[];
  /** Fase a la que tiene acceso el usuario logeado. */
  codigoFase: string;

  form: FormGroup;
  isForm: Promise<any>;

  subs: Subscription[] = [];
  colores: any[];
  rolesHijos: any[];
  fases: any[];
  codigosRoles: any[];
  tipoEventoSelected: any;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) {
    super();
    this.codigosRoles = [];
    this.tipoEventos = [];
    this.fases = [];
  }

  ngOnInit() {
    // Obtenemos el rol del usuario para obtener los processDefinitionKey a los que tiene acceso.
    const user = this.frontService.authentication.getUser();
    this.codigosRoles = user.roles.map((rol: any) => rol.code);

    forkJoin({
      _colorimetria: this.backService.colorimetria.getColorimetria(),
      _tipoEventos: this.backService.evento.obtenerEventos({}),
      _fases: this.backService.fases.getFases({codigoRolLider: this.codigosRoles})
    }).subscribe(item => {
      this.fases = item._fases._embedded.mimRolLiderFlujo.map(x => x.mimFaseFlujo);
      if (!this.fases.length) {
        this.translate.get('error.403.mensaje').subscribe(msn => {
          this.frontService.alert.info(msn).then(() => { this.router.navigate([UrlRoute.PAGES]); });
        });
        return;
      }
      this.colores = item._colorimetria.content;
      this.tipoEventos = item._tipoEventos;
      this.initForm();
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoEvento: new FormControl(null, [Validators.required]),
        fases: new FormControl(null),
        usuarios: new FormControl(null, [Validators.required]),
        numeroCasos: new FormControl(null)
      })
    );

    this.onChanges();
  }

  onChanges() {
    this.form.controls.tipoEvento.valueChanges.subscribe(tipoEvento => {
      this.tipoEventoSelected = tipoEvento;
      if (this.codigoFase) {
        this.getUsuarios();
        this.obtenerTareas(this.tipoEventoSelected.nombreProceso);
      }
    });

    this.form.controls.fases.valueChanges.subscribe((item: any) => {
      this.codigoFase = item.codigo;
      if (this.tipoEventoSelected) {
        this.getUsuarios();
        this.obtenerTareas(this.tipoEventoSelected.nombreProceso);
      }
    });

    this.form.controls.numeroCasos.valueChanges.subscribe(numeroCasos => {
      // Debemos limpiar la seleccion en la tabla.
      this.configuracion.gridAsignacionGestionDiaria.component.deselectAllRows();

      // Ademas si numeroCasos tiene algun valor entonces deshabilitamos la seleccion de la tabla.
      if (numeroCasos !== null && numeroCasos !== undefined && numeroCasos > 0) {
        this.configuracion.gridAsignacionGestionDiaria.selectModeDisable = true;
      } else {
        this.configuracion.gridAsignacionGestionDiaria.selectModeDisable = false;
      }
    });
  }

  obtenerTareas(processDefinitionKey: string, pagina = 0, tamanio = 10) {
    this.backService.runtime.getRuntimeTasks({
      processDefinitionKey,
      includeProcessVariables: true,
      includeSuperProcessVariables: true,
      unassigned: true,
      active: true,
      category: this.codigoFase,
      isPaged: false,
      isSorted: true,
      sort: 'actHiProcinst.startTime,asc',
      size: tamanio,
      page: pagina
    }).subscribe((respuesta: any) => {
      const content = respuesta.content;

      this.configuracion.gridAsignacionGestionDiaria.component.limpiar();

      if (!content || content.length === 0) {
        return;
      }

      content.forEach((task: any) => {
        task._solicitante = `${task.variables.identificacionAsociado ? task.variables.identificacionAsociado : ''} - ${
          task.variables.nombreAsociado ? task.variables.nombreAsociado : ''}`;
        task._tipoEvento = this.obtenerTipoEvento(task.variables.codigoEvento);
      });

      this.configuracion.gridAsignacionGestionDiaria.component.cargarDatos(
        this.asignarColor(content.sort((a, b) => b.processDaysManagement - a.processDaysManagement)), {
          maxPaginas: respuesta.totalPages,
          pagina: respuesta.number,
          cantidadRegistros: respuesta.totalElements
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private obtenerTipoEvento(codigo: any) {
    return this.tipoEventos ? this.tipoEventos.find(tipoEvento => tipoEvento.codigo === codigo) : null;
  }

  habilitarAsignar() {
    if (this.form === undefined || this.form === null) {
      return false;
    }

    const tareasSeleccionadas: string[] = this.configuracion.gridAsignacionGestionDiaria.component.obtenerTodosSeleccionados();
    const hayTareasSeleccionadas = tareasSeleccionadas && tareasSeleccionadas.length > 0;

    const numeroCasos: number = this.form.controls.numeroCasos.value;
    const hayNumeroCasos = numeroCasos && Number(numeroCasos) > 0;

    return this.form.valid && (hayTareasSeleccionadas || hayNumeroCasos);
  }

  asignar() {
    const tareasSeleccionadas: string[] = this.configuracion.gridAsignacionGestionDiaria.component.obtenerTodosSeleccionados();
    const hayTareasSeleccionadas = tareasSeleccionadas && tareasSeleccionadas.length > 0;

    const numeroCasos: number = this.form.controls.numeroCasos.value;
    const hayNumeroCasos = numeroCasos && Number(numeroCasos) > 0;

    // Se valida si no hay tareas seleccionadas ni numero de casos.
    if (!hayTareasSeleccionadas && !hayNumeroCasos) {
      this.translate.get('administracion.asignacionGestionDiaria.filter.seleccionarNumeroCasosOCasos').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });

      return;
    }

    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });

      return;
    }

    const userIds = this.form.controls.usuarios.value.map((usuario: any) => usuario.username);
    const taskIds = tareasSeleccionadas.map((tarea: any) => tarea.taskId);
    const peticion = {
      userIds: userIds,
      taskIds: taskIds,
      cases: numeroCasos,
      processDefinitionKey: this.form.controls.tipoEvento.value.nombreProceso,
      category: this.codigoFase,
      force: false,
      typeAssign: false
    };

    this.backService.tarea.realizarAsignacionDiaria(peticion).subscribe((respuesta: any) => {

      this.configuracion.modalResumen.component.mostrar();
      this.configuracion.gridResumen.component.limpiar();

      if (!respuesta || respuesta.length === 0) {
        return;
      }

      respuesta.forEach((task: any) => {
        task._solicitante = `${task.variables.identificacionAsociado ? task.variables.identificacionAsociado : ''} - ${
          task.variables.nombreAsociado ? task.variables.nombreAsociado : ''}`;
        task._tipoEvento = this.obtenerTipoEvento(task.variables.codigoEvento);
      });

      this.configuracion.gridResumen.component.cargarDatos(
        respuesta, {
        pagina: 0,
        cantidadRegistros: respuesta.length
      });

      // Reseteamos controles de asignacion. (Excepto desplegable de evento)
      this.form.controls.usuarios.reset();
      this.form.controls.numeroCasos.reset();
      this.configuracion.gridAsignacionGestionDiaria.component.deselectAllRows();

      // Recargamos datos de la lista principal.
      this.obtenerTareas(this.form.controls.tipoEvento.value.nombreProceso);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  cerrarModal() {
    this.configuracion.modalResumen.component.ocultar();
  }

  alSeleccionar(event: any) {
    // do nothing
  }

  alDeseleccionar(event: any) {
    // do nothing
  }

  asignarColor(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _processInstanceId: item.superProcessInstanceId ? item.superProcessInstanceId : item.processInstanceId,
        _color: this.colores.find(x =>
        (x.rangoInicial <= item.processDaysManagement && x.rangoFinal && x.rangoFinal >= item.processDaysManagement) ||
           (!x.rangoFinal)
        ).color
      });
    }
    return listObj;
  }

  private async getUsuarios() {
    if (this.form.controls.usuarios.value) {
      this.form.controls.usuarios.reset();
    }
    const _rolesHijos = await this.backService.fases.getRolesFlujo({
                          codigoFase: this.codigoFase,
                          codigoProceso: this.tipoEventoSelected.nombreProceso
                        }).toPromise();

    const codigoRolesPorFase: any = [... new Set(_rolesHijos._embedded.mimRolesFlujo.map(x => x.codigoRol))];
    const _user = [];
    let _dataUser: any;
    for (let item = 0; item < codigoRolesPorFase.length; item ++) {
      _dataUser = await this.backService.sispro.getUsuariosPorRol(codigoRolesPorFase[item]).toPromise();
      _dataUser.forEach(user => {
        if (!_user.find(t => t.username === user.username)) {
          _user.push({...user, nombre: user.name});
        }
      });
    }
    this.usuarios = _user;
  }

  _onClickCeldaElement(event) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_EVENTOS,
      event.dato.variables.asoNumInt,
      UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
      event.dato.processInstanceId,
      UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.obtenerTareas(this.form.controls.tipoEvento.value.nombreProceso, e.pagina, e.tamano);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtenerTareas(this.form.controls.tipoEvento.value.nombreProceso, e.pagina, e.tamano);
  }

}
