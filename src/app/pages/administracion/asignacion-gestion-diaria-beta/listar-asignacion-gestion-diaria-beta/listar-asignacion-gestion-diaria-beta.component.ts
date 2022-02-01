import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Subscription } from 'rxjs';
import { ListarAsignacionGestionDiariaConfig } from './listar-asignacion-gestion-diaria.config';

@Component({
  selector: 'app-listar-asignacion-gestion-diaria-beta',
  templateUrl: './listar-asignacion-gestion-diaria-beta.component.html',
})
export class ListarAsignacionGestionDiariaBetaComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ListarAsignacionGestionDiariaConfig = new ListarAsignacionGestionDiariaConfig();
  usuarios: any[];
  tipoSolicitudes: any[];
  tipoSolicitudesHijas: any[];
  /** Fase a la que tiene acceso el usuario logeado. */
  codigoFase: string;
  codigoTipoSolicitud: any;
  codigoSolicitud: any;
  codigoProceso: any;

  form: FormGroup;
  isForm: Promise<any>;

  subs: Subscription[] = [];
  colores: any[];
  fases: any[];
  solicitudes: any;
  tareas: any;
  tareasAll: any;
  esSolicitudMultiple: boolean;
  tieneSolicitudHija: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router
  ) {
    super();
    this.fases = [];
    this.esSolicitudMultiple = false;
    this.tieneSolicitudHija = false;
  }

  ngOnInit(): void {
    forkJoin({
      _colorimetria: this.backService.colorimetria.getColorimetria(),
      _tipoSolicitudes: this.backService.tipoSolicitud.getMimTipoSolicitud({estado : true})
    }).subscribe(item => {
      this.colores = item._colorimetria.content;
      this.tipoSolicitudes = item._tipoSolicitudes.content;
      this.initForm();
    }, err => this.frontService.alert.error(err.error.message));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => { sub.unsubscribe(); });
  }

  initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoSolicitud: new FormControl(null, [Validators.required]),
        tipoSolicitudHija: new FormControl(null, [Validators.required]),
        solicitud: [null],
        fases: new FormControl(null),
        tarea: [null],
        usuarios: new FormControl(null, [Validators.required]),
        numeroCasos: new FormControl(null)
      })
    );

    this.onChanges();
  }

  onChanges() {
    this.form.controls.tipoSolicitud.valueChanges.subscribe(tipoSolicitud => {
      if (tipoSolicitud) {
        this.solicitudes = [];
        this.tipoSolicitudesHijas = [];
        this.fases = [];
        this.tareas = [];
        this.codigoProceso = null;
        this.codigoSolicitud = null;
        this.codigoTipoSolicitud = tipoSolicitud.codigo;
        if (tipoSolicitud.mimTipoSolicitudList && tipoSolicitud.mimTipoSolicitudList.length !== 0) {
          this.form.controls.tipoSolicitudHija.setValue(null);
          this.tieneSolicitudHija = true;
          this.tipoSolicitudesHijas = tipoSolicitud.mimTipoSolicitudList;
          this.form.controls.tipoSolicitudHija.enable();
          this.form.controls.tipoSolicitudHija.setErrors({ 'required': true });
        } else {
          this.tieneSolicitudHija = false;
          this.cargarSolicitudes(this.codigoTipoSolicitud);
          this.form.controls.tipoSolicitudHija.setValue(null);
          this.form.controls.tipoSolicitudHija.disable();
          this.form.controls.tipoSolicitudHija.setErrors(null);
        }
      }
    });

    this.form.controls.tipoSolicitudHija.valueChanges.subscribe(tipoSolicitudHija => {
      if (tipoSolicitudHija) {
        this.solicitudes = [];
        this.fases = [];
        this.tareas = [];
        this.codigoProceso = null;
        this.codigoSolicitud = null;
        this.codigoTipoSolicitud = tipoSolicitudHija.codigo;
        this.cargarSolicitudes(this.codigoTipoSolicitud);
      }
    });

    this.form.controls.solicitud.valueChanges.subscribe(solicitud => {

      if (solicitud) {
        this.codigoProceso = this.esSolicitudMultiple ? solicitud[0].codigoProceso : solicitud.codigoProceso;
        this.codigoSolicitud = this.esSolicitudMultiple ? [[...new Set(solicitud.map(x => x.mimSolicitudPK.codigo))]] : solicitud.mimSolicitudPK.codigo;

        this.form.controls.fases.setValue(null);
        this.backService.fases.getRolesFlujo({ 'codigoProceso': this.codigoProceso}).subscribe(respFases => {
          this.fases = [];
          this.tareas = [];
          this.usuarios = [];
          this.cargarFasesTareas(respFases._embedded.mimRolesFlujo);
        }, (err) => {
          this.frontService.alert.error(err.error.message);
          this.form.controls.fases.setValue(null);
          this.form.controls.tarea.setValue(null);
        });
      }
    });

    this.form.controls.fases.valueChanges.subscribe((item: any) => {
      this.form.controls.tarea.setValue(null);
      if (!item) {
        this.tareas = null;
        this.usuarios = null;
        return;
      }

      this.codigoFase = item.codigoFase;
      this.tareas = this.tareasAll.filter(x => x.codigoFase === item.codigoFase);
      if (this.form.controls.solicitud.value) {
        this.getUsuarios();
      }
    });

    this.form.controls.tarea.valueChanges.subscribe((item: any) => {
      this.form.controls.usuarios.setValue(null);
      if (!item) {
        this.tareas = null;
        this.configuracion.gridAsignacionGestionDiaria.component.limpiar();
        return;
      }
      this.obtenerTareas();
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

  private cargarFasesTareas(rolesFlujo: any) {
    const _fases = rolesFlujo.filter(x => x.codigoFase && x.nombreFase).map(x => {
      return {
        codigoFase: x.codigoFase,
        nombreFase: x.nombreFase,
        codigoRol: x.codigoRol,
        codigoProceso: x.codigoProceso
      };
    });
    this.fases = this.removerRepetidos(_fases);

    const _tareas = rolesFlujo.filter(x => x.codigoTarea && x.nombreTarea).map(x => {
      return {
        codigoFase: x.codigoFase,
        codigoTarea: x.codigoTarea,
        nombreTarea: x.nombreTarea,
        codigoRol: x.codigoRol,
        codigoProceso: x.codigoProceso
      };
    });
    this.tareasAll = this.removerRepetidos(_tareas);
  }

  private cargarSolicitudes(codigoSolicitud: any) {
    this.form.controls.solicitud.setValue(null);
    this.tipoControlSolicitud(codigoSolicitud);
    this.backService.solicitud.getMimSolicitud({ 'mimTipoSolicitud.codigo': codigoSolicitud })
    .subscribe(respSolicitudes => {
      this.solicitudes = respSolicitudes.content;
    }, (err) => {
      this.frontService.alert.error(err.error.message);
      this.form.controls.solicitud.setValue(null);
    });

  }

  obtenerTareas(pagina = 0, tamanio = 10) {
    const params = {
      includeProcessVariables: true,
      includeSuperProcessVariables: true,
      unassigned: true,
      active: true,
      category: this.codigoFase,
      isPaged: false,
      isSorted: true,
      sort: 'processInstanceId,asc',
      size: tamanio,
      page: pagina,
      codigoTipoSolicitud: this.codigoTipoSolicitud,
      taskDefinitionKey: this.form.controls.tarea.value.codigoTarea
    } as any;

    if (this.codigoSolicitud === GENERALES.CODIGO_SOLICITUD_PADRE && this.codigoTipoSolicitud !== GENERALES.TIPO_SOLICITUD_FLUJO.RECLAMACIONES) {
      params.codigoSolicitudPadre = this.codigoSolicitud;
    } else {
      params.codigoSolicitud = this.codigoSolicitud;
    }

    this.backService.tarea.getRuntimeTask(params).subscribe(respuesta => {
      const content = respuesta.content;

      this.configuracion.gridAsignacionGestionDiaria.component.limpiar();

      if (!content || content.length === 0) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe(msn => {
          this.frontService.alert.info(msn);
        });
        return;
      }

      this.configuracion.gridAsignacionGestionDiaria.component.cargarDatos(
        this.asignarColor(content.sort((a, b) => b.processDaysManagement - a.processDaysManagement)), {
        maxPaginas: respuesta.totalPages,
        pagina: respuesta.number,
        cantidadRegistros: respuesta.totalElements
      });

    }, err => this.frontService.alert.error(err.error.message));
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
    this.form.disable({emitEvent: false});
    const _form = this.form.getRawValue();
    const tareasSeleccionadas: string[] = this.configuracion.gridAsignacionGestionDiaria.component.obtenerTodosSeleccionados();
    const hayTareasSeleccionadas = tareasSeleccionadas && tareasSeleccionadas.length > 0;

    const numeroCasos: number = _form.numeroCasos;
    const hayNumeroCasos = numeroCasos && Number(numeroCasos) > 0;

    // Se valida si no hay tareas seleccionadas ni numero de casos.
    if (!hayTareasSeleccionadas && !hayNumeroCasos) {
      this.translate.get('administracion.asignacionGestionDiaria.filter.seleccionarNumeroCasosOCasos').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      this.form.enable({emitEvent: false});
      return;
    }

    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      this.form.enable({emitEvent: false});
      return;
    }

    const userIds = _form.usuarios.map((usuario: any) => usuario.username);
    const taskIds = tareasSeleccionadas.map((tarea: any) => tarea.taskId);
    const peticion = {
      userIds: userIds,
      taskIds: taskIds,
      cases: numeroCasos,
      processDefinitionKey: this.codigoProceso,
      category: this.codigoFase,
      force: true,
      typeAssign: false
    };

    this.backService.tarea.realizarAsignacionDiaria(peticion).subscribe((respuesta: any) => {
      this.form.enable({emitEvent: false});
      this.configuracion.modalResumen.component.mostrar();

      this.configuracion.gridResumen.component.limpiar();

      if (!respuesta || respuesta.length === 0) {
        return;
      }

      this.configuracion.gridResumen.component.cargarDatos(
        respuesta, {
        pagina: 0,
        cantidadRegistros: respuesta.length
      });

      // Reseteamos controles de asignacion. (Excepto desplegable de evento)
      this.form.controls.usuarios.reset();
      this.form.controls.numeroCasos.reset();
      this.configuracion.gridAsignacionGestionDiaria.component.deselectAllRows();

    }, (err) => {
      this.form.enable({emitEvent: false});
      this.frontService.alert.error(err.error.message);
    });
  }

  cerrarModal() {
    // Recargamos datos de la lista principal.
    this.obtenerTareas();
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
      codigoProceso: this.codigoProceso
    }).toPromise();

    const codigoRolesPorFase: any = [... new Set(_rolesHijos._embedded.mimRolesFlujo.map(x => x.codigoRol))];
    const _user = [];
    let _dataUser: any;
    for (let item = 0; item < codigoRolesPorFase.length; item++) {
      _dataUser = await this.backService.sispro.getUsuariosPorRol(codigoRolesPorFase[item]).toPromise();
      _dataUser.forEach(user => {
        if (!_user.find(t => t.username === user.username)) {
          _user.push({ ...user, nombre: user.name });
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
      event.dato.superProcessInstanceId ? event.dato.superProcessInstanceId : event.dato.processInstanceId,
      UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA
    ]);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para ir a la siguiente pagina de la grid
   */
  _onSiguiente(e: any) {
    this.obtenerTareas(e.pagina, e.tamano);
  }

  /**
   * Autor: Cesar Millan
   * Función: Acción para regresar a la página anterior de una grid
   */
  _onAtras(e: any) {
    this.obtenerTareas(e.pagina, e.tamano);
  }

  private removerRepetidos(listaObj: any) {
    return [...new Set(listaObj.map(JSON.stringify))].map((x: any) => JSON.parse(x));
  }

  private tipoControlSolicitud(codigoSolicitud: any) {
    switch (codigoSolicitud) {
      case GENERALES.TIPO_SOLICITUD_FLUJO.INCREMENTOS:
        this.esSolicitudMultiple = true;
        break;
      case GENERALES.TIPO_SOLICITUD_FLUJO.DISMINUCIONES:
        this.esSolicitudMultiple = true;
        break;
      default:
        this.esSolicitudMultiple = false;
        break;
    }
  }

}
