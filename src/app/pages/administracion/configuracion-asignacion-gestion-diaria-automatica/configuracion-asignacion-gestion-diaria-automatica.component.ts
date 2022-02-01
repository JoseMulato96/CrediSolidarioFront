import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfiguracionAsignacionGestionDiariaAutomaticaConfig } from './configuracion-asignacion-gestion-diaria-automatica.config';

@Component({
  selector: 'app-configuracion-asignacion-gestion-diaria-automatica',
  templateUrl: './configuracion-asignacion-gestion-diaria-automatica.component.html',
})
export class ConfiguracionAsignacionGestionDiariaAutomaticaComponent extends FormValidate implements OnInit, FormComponent {

  configuracion: ConfiguracionAsignacionGestionDiariaAutomaticaConfig = new ConfiguracionAsignacionGestionDiariaAutomaticaConfig();
  mostrarGuardar: boolean;
  isForm: Promise<any>;
  form: FormGroup;
  formUsFa: FormGroup;
  dataInit: any;
  esCreacion: boolean;
  openModal: boolean;
  tieneSolicitudHija: boolean;

  codigoConfiguracion: any;
  codigoProceso: any;
  tipoSolicitudes: any[];
  tipoSolicitudesHijas: any[];
  solicitudes: any[];
  fases: any[];
  tareas: any[];
  tareasAll: any[];
  usuariosSeleccionados: any[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.mostrarGuardar = false;
    this.openModal = false;
    this.tieneSolicitudHija = false;
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getDataSelectForm();
  }

  private getDataSelectForm() {
    forkJoin({
      _tipoSolicitudes: this.backService.tipoSolicitud.getMimTipoSolicitud({ estado: true })
    }).subscribe(item => {
      this.initForm();
      this.initFormArray();
      this.getDataTabla();
      this.openModal = true;
      this.tipoSolicitudes = item._tipoSolicitudes.content;
      this.setDataInit();

    }, (err) => {
      this.frontService.alert.error(err.error.message);
      this.mostrarGuardar = false;
    });

  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  get usuarioSolicitud() {
    return this.form.controls.formGestionDiaria['controls'].usuarioSolicitud as FormArray;
  }

  private initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        formGestionDiaria: this.formBuilder.group({
          tipoSolicitud: [this.tieneSolicitudHija ? this.getTipoSolicitud(params.mimTipoSolicitudPadre.codigo) :
            params && params.mimSolicitud ? this.getTipoSolicitud(params.mimSolicitud.mimTipoSolicitud.codigo) : null, [Validators.required]],
          tipoSolicitudHija: [this.tieneSolicitudHija ? this.getTipoSolicitudHija(params.mimSolicitud.mimTipoSolicitud.codigo) : null, [Validators.required]],
          solicitud: [params && params.mimSolicitud ? this.getSolicitud(params.mimSolicitud.mimSolicitudPK.codigo,
            params.mimSolicitud.mimSolicitudPK.codigoTipoSolicitud) : null, [Validators.required]],
          fase: [params && params.mimRolesFlujo ? this.getFase(params.mimRolesFlujo.codigoFase) : null, [Validators.required]],
          tarea: [params && params.mimRolesFlujo ? this.getTarea(params.mimRolesFlujo.codigoTarea) : null, [Validators.required]],
          usuarioSolicitud: this.formBuilder.array([])
        })
      })
    );

    if (params && params.mimSolicitud) {
      const form = this.form.controls.formGestionDiaria['controls'];
      form.tipoSolicitud.disable();
      form.tipoSolicitudHija.disable();
      form.solicitud.disable();
      form.fase.disable();
      form.tarea.disable();
    }
    this.onChange();
  }


  setDataInit() {
    this.dataInit = {
      tipoSolicitudes: this.tipoSolicitudes,
      tieneSolicitudHija: this.tieneSolicitudHija,
      tipoSolicitudesHijas: this.tipoSolicitudesHijas,
      solicitudes: this.solicitudes,
      fases: this.fases,
      tareas: this.tareas,
      usuarios: this.usuarioSolicitud
    };
  }

  private cargarDatos(datos: any) {

    this.codigoConfiguracion = datos.codigo;
    this.tieneSolicitudHija = datos.mimTipoSolicitudPadre ? true : false;
    const codigoTipoSolicitud = datos.mimSolicitud.mimSolicitudPK.codigoTipoSolicitud;
    const codigoProceso = datos.mimRolesFlujo.codigoProceso;
    const codigoFase = datos.mimRolesFlujo.codigoFase;

    forkJoin({
      _solicitudes: this.backService.solicitud.getMimSolicitud({ 'mimTipoSolicitud.codigo': codigoTipoSolicitud }),
      _rolesFlujo: this.backService.fases.getRolesFlujo({ 'codigoProceso': codigoProceso })
    }).pipe(
      map((item: any) => {
        return {
          _solicitudes: item._solicitudes.content,
          _rolesFlujo: item._rolesFlujo._embedded.mimRolesFlujo
        };
      })
    ).subscribe(x => {
      this.solicitudes = x._solicitudes;
      this.tipoSolicitudesHijas = this.tieneSolicitudHija ? datos.mimTipoSolicitudPadre.mimTipoSolicitudList : [];
      this.cargarFasesTareas(x._rolesFlujo);
      this.tareas = this.tareasAll.filter(y => y.codigoFase === codigoFase);
      this.getUsuariosFase(codigoFase, codigoProceso, datos.mimAsignacionDiariaUsuarioList);
      this.initForm(datos);
      this.setDataInit();

    }, (err) => {
      this.frontService.alert.error(err.error.message);
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
        codigo: x.codigo,
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
    this.backService.solicitud.getMimSolicitud({ 'mimTipoSolicitud.codigo': codigoSolicitud })
      .subscribe(respSolicitudes => {
        this.solicitudes = respSolicitudes.content;
        this.fases = [];
        this.tareas = [];
        this.setDataInit();
      }, (err) => {
        this.frontService.alert.error(err.error.message);
        this.form.controls.formGestionDiaria['controls'].solicitud.setValue(null);
      });

  }

  private onChange() {

    const form = this.form.controls.formGestionDiaria['controls'];

    form.tipoSolicitud.valueChanges.subscribe(tipoSolicitud => {
      if (tipoSolicitud) {
        this.solicitudes = [];
        this.tipoSolicitudesHijas = [];
        this.fases = [];
        this.tareas = [];
        this.initFormArray();
        if (tipoSolicitud.mimTipoSolicitudList && tipoSolicitud.mimTipoSolicitudList.length !== 0) {
          this.tieneSolicitudHija = true;
          this.tipoSolicitudesHijas = tipoSolicitud.mimTipoSolicitudList;
          form.tipoSolicitudHija.enable();
          form.tipoSolicitudHija.setErrors({ 'required': true });
          this.setDataInit();
        } else {
          this.tieneSolicitudHija = false;
          this.cargarSolicitudes(tipoSolicitud.codigo);
          form.tipoSolicitudHija.setValue(null);
          form.tipoSolicitudHija.disable();
          form.tipoSolicitudHija.setErrors(null);
        }
      }
    });

    form.tipoSolicitudHija.valueChanges.subscribe(tipoSolicitudHija => {
      if (tipoSolicitudHija) {
        this.solicitudes = [];
        this.fases = [];
        this.tareas = [];
        this.cargarSolicitudes(tipoSolicitudHija.codigo);
      }
    });

    form.solicitud.valueChanges.subscribe(solicitud => {
      if (solicitud) {
        this.codigoProceso = solicitud.codigoProceso;
        this.backService.fases.getRolesFlujo({ 'codigoProceso': this.codigoProceso }).subscribe(respFases => {
          this.fases = [];
          this.tareas = [];
          this.cargarFasesTareas(respFases._embedded.mimRolesFlujo);
          this.setDataInit();
        }, (err) => {
          this.frontService.alert.error(err.error.message);
          form.fase.setValue(null);
          form.tarea.setValue(null);
        });
      }
    });

    form.fase.valueChanges.subscribe((fase: any) => {
      if (fase) {
        this.tareas = this.tareasAll.filter(x => x.codigoFase === fase.codigoFase);
        this.setDataInit();
        if (form.solicitud.value) {
          this.getUsuariosFase(fase.codigoFase, this.codigoProceso);
        }
      }
    });

  }

  private removerRepetidos(listaObj: any) {
    return [...new Set(listaObj.map(JSON.stringify))].map((x: any) => JSON.parse(x));
  }

  getDataTabla(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {

    const param: any = { page: pagina, size: tamanio, isPaged: true, sort };
    this.backService.asignacionDiaria.getConfiguracionesGestionDiaria(param)
      .subscribe((configuracionesGestionDiaria: any) => {
        this.configuracion.gridListarGestionDiaria.component.limpiar();

        if (!configuracionesGestionDiaria || !configuracionesGestionDiaria.content || configuracionesGestionDiaria.content.length === 0) {
          return;
        }

        this.configuracion.gridListarGestionDiaria.component.cargarDatos(
          configuracionesGestionDiaria.content, {
          maxPaginas: configuracionesGestionDiaria.totalPages,
          pagina: configuracionesGestionDiaria.number,
          cantidadRegistros: configuracionesGestionDiaria.totalElements
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  private getTipoSolicitud(codigo: any) {
    return this.tipoSolicitudes ? this.tipoSolicitudes.find(tipoSolicitud => tipoSolicitud.codigo === codigo) : null;
  }

  private getTipoSolicitudHija(codigo: any) {
    return this.tipoSolicitudesHijas ? this.tipoSolicitudesHijas.find(tipoSolicitud => tipoSolicitud.codigo === codigo) : null;
  }

  private getSolicitud(codigoSolicitud: any, codigoTipoSolicitud: any) {
    return this.solicitudes ? this.solicitudes.find(solicitud =>
      solicitud.mimSolicitudPK.codigo === codigoSolicitud &&
      solicitud.mimSolicitudPK.codigoTipoSolicitud === codigoTipoSolicitud) : null;
  }

  private getFase(codigo: any) {
    return this.fases ? this.fases.find(fase => fase.codigoFase === codigo) : null;
  }

  private getTarea(codigo: any) {
    return this.tareas ? this.tareas.find(tarea => tarea.codigoTarea === codigo) : null;
  }

  async onClickCeldaElement(event: any) {
    if (event.col.key === 'editar') {
      this.cargarDatos(event.dato);
      this.esCreacion = false;
      this.mostrarGuardar = true;
    } else {
      this.irAEliminar(event.dato.codigo);
    }
  }

  private irAEliminar(codigo: any) {
    this.translate.get('administracion.gestionDiariaAutomatica.alertas.deseaEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe((decision: any) => {
        if (decision === true) {
          this.backService.asignacionDiaria.eliminarConfiguracionGestionDiaria(codigo).subscribe(resp => {
            this.translate.get('global.eliminadoExitosoMensaje').subscribe((mensaje: string) => {
              this.frontService.alert.success(mensaje).then(() => {
                this.getDataTabla();
              });
            });
          }, (err) => {
            this.frontService.alert.error(err.error.message);
          });
        }
      });
    });
  }

  onSiguiente(e: any) {
    this.getDataTabla(e.pagina, e.tamano, e.sort);
  }

  onAtras(e: any) {
    this.getDataTabla(e.pagina, e.tamano, e.sort);
  }

  crearAsignacionGestionDiaria() {
    if (this.openModal) {
      this.refrescarDatos();
      this.mostrarGuardar = true;
      this.esCreacion = true;
    }
  }

  cerrarModal() {
    if (this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.form.reset({ emitEvent: false });
          this.form.controls.formGestionDiaria.markAsPristine();
        }
      });
    } else {
      this.form.reset({ emitEvent: false });
      this.form.controls.formGestionDiaria.markAsPristine();
      this.mostrarGuardar = false;
    }
  }

  crearConfiguracionGestionDiaria() {

    const form = this.form.controls.formGestionDiaria['controls'];
    const mimAsignacionDiaria = {
      mimSolicitud: {
        mimSolicitudPK: {
          codigo: form.solicitud.value.mimSolicitudPK.codigo,
          codigoTipoSolicitud: form.solicitud.value.mimSolicitudPK.codigoTipoSolicitud
        }
      },
      mimRolesFlujo: { codigo: form.tarea.value.codigo },
      mimAsignacionDiariaUsuarioList: this.usuariosSeleccionados.map(x => ({
        mimAsignacionDiariaUsuarioPK: {
          usuarioFase: x.username
        },
        numeroCasos: x.numeroCaso
      }))
    };

    this.backService.asignacionDiaria.crearConfiguracionGestionDiaria(mimAsignacionDiaria).subscribe(resp => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.refrescarDatos();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  actualizarConfiguracionGestionDiaria() {

    const form = this.form.controls.formGestionDiaria['controls'];
    const mimAsignacionDiaria = {
      codigo: this.codigoConfiguracion,
      mimSolicitud: {
        mimSolicitudPK: {
          codigo: form.solicitud.value.mimSolicitudPK.codigo,
          codigoTipoSolicitud: form.solicitud.value.mimSolicitudPK.codigoTipoSolicitud
        }
      },
      mimRolesFlujo: { codigo: form.tarea.value.codigo },
      mimAsignacionDiariaUsuarioList: this.usuariosSeleccionados.map(x => ({
        mimAsignacionDiariaUsuarioPK: {
          codigoAsignacionDiaria: this.codigoConfiguracion,
          usuarioFase: x.username
        },
        numeroCasos: x.numeroCaso
      }))
    };

    this.backService.asignacionDiaria.editarConfiguracionGestionDiaria(this.codigoConfiguracion, mimAsignacionDiaria
    ).subscribe(resp => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.refrescarDatos();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  guardarConfiguracionGestionDiaria() {

    const formGestionDiaria = this.form.controls.formGestionDiaria;
    if (formGestionDiaria.invalid) {
      this.validateForm(formGestionDiaria as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }

    this.usuariosSeleccionados = formGestionDiaria.value.usuarioSolicitud.filter(x => x.selected === true);
    if (!this.usuariosSeleccionados || this.usuariosSeleccionados.length === 0) {
      this.translate.get('administracion.gestionDiariaAutomatica.alertas.usuarioFase').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    let tieneNumeroCaso = true;
    this.usuariosSeleccionados.forEach(usuarioSeleccionado => {
      if (!usuarioSeleccionado.numeroCaso || usuarioSeleccionado.numeroCaso <= 0) {
        return tieneNumeroCaso = false;
      }
    });

    if (!tieneNumeroCaso) {
      this.translate.get('administracion.gestionDiariaAutomatica.alertas.nroSolicitudes').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.esCreacion) {
      this.crearConfiguracionGestionDiaria();
    } else {
      this.actualizarConfiguracionGestionDiaria();
    }
  }

  private refrescarDatos() {
    this.getDataTabla();
    const form = this.form.controls.formGestionDiaria;
    const controls = form['controls'];
    controls.tipoSolicitud.enable();
    controls.solicitud.enable();
    controls.fase.enable();
    controls.tarea.enable();
    form.reset();
    form.markAsPristine();
    this.initFormArray();
    this.setDataInit();
    this.mostrarGuardar = false;
  }

  private async getUsuariosFase(codigoFase?: any, codigoProceso?: any, usuariosList?: any) {
    const _rolesHijos = await this.backService.fases.getRolesFlujo({
      codigoFase: codigoFase,
      codigoProceso: codigoProceso
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    this.usuarioSolicitud.clear();
    const codigoRolesPorFase: any = [... new Set(_rolesHijos._embedded.mimRolesFlujo.map(x => x.codigoRol))];
    const _user = [];
    let _dataUser: any;
    for (let item = 0; item < codigoRolesPorFase.length; item++) {
      _dataUser = await this.backService.sispro.getUsuariosPorRol(codigoRolesPorFase[item]).toPromise();
      _dataUser.forEach(user => {
        if (!_user.find(t => t.username === user.username)) {

          let selected = false;
          let numeroCaso = 1;

          if (usuariosList) {
            usuariosList.forEach(usuarioSeleccionado => {
              if (user.username === usuarioSeleccionado.mimAsignacionDiariaUsuarioPK.usuarioFase) {
                selected = true;
                numeroCaso = usuarioSeleccionado.numeroCasos;
              }
            });
          }

          _user.push({ ...user, nombre: user.name, selected: selected, numeroCaso: numeroCaso });
          this.formUsFa = this.formBuilder.group({
            username: user.username,
            nombre: user.name,
            selected: selected,
            numeroCaso: numeroCaso,
            bloqueo: false
          });
          this.usuarioSolicitud.push(this.formUsFa);
        }
      });
    }
    this.setDataInit();
  }

  initFormArray() {
    this.usuarioSolicitud.clear();
    this.formUsFa = this.formBuilder.group({
      username: null,
      nombre: 'No hay usuarios parametrizados',
      selected: false,
      numeroCaso: 1,
      bloqueo: true
    });
    this.usuarioSolicitud.push(this.formUsFa);
  }
}
