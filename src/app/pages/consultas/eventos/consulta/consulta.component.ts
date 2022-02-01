import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupMenuComponent } from '@shared/components/popup-menu/popup-menu.component';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { CodigosMenu } from '@shared/static/urls/codigos-menu';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsultaEventosConfig } from './consulta.config';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html'
})
export class ConsultaEventosComponent extends FormValidate implements OnInit, OnDestroy {
  constructor(public formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); this.initFormGroup(); }

  configuracion: ConsultaEventosConfig = new ConsultaEventosConfig();

  @ViewChild(PopupMenuComponent) popupMenu: PopupMenuComponent;

  _isLoad: Promise<any>;
  form: FormGroup;
  formObservacion: FormGroup;
  isForm: Promise<any>;
  formAnulacion: FormGroup;
  isFormAnulacion: Promise<any>;
  patterns = masksPatterns;
  subs: Subscription[] = [];
  estados: any[] = [];
  asoNumInt: string;
  datosAsociado: any;
  mostrarBotonNuevoEvento: boolean;
  datoProceso: any;
  tipoConsulta: any;
  radicacion: boolean;
  mostrarModalAnulacion: boolean;
  mostrarModalObservaciones: boolean;
  mostrarUsuariosAnulacion: boolean;
  idProceso: string;
  solicitudEvento: any;
  razonesAnulacion: any[];
  usuariosAnulacion: any[];
  datosFlujo: any;
  habilitarGuardar: boolean;

  ngOnInit() {

    this.subs.push(this.route.queryParams.subscribe((params) => {
      if (!this.estados.length) {
        this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPO_ESTADOS_RECLAMACIONES.TIP_COD).subscribe(resultado => {

          if (resultado && resultado.sipParametrosList) {
            resultado.sipParametrosList.forEach(x => {
              this.estados.push(x.sipParametrosPK.codigo);
            });
            this.validarParametros(params);
          }
        }, err => {
          this.frontService.alert.error(err.error.message);
        });

      } else {
        this.validarParametros(params);
      }
    }));

    this.initFormAnulacion();
    this.initFormObservacion();
  }

  initFormObservacion(){
    this.formObservacion = this.formBuilder.group({
      controlObservacion: [null, [Validators.required, Validators.maxLength(999), CustomValidators.cannotContainSpace]]
    });
  }


  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
    this.subs = undefined;
  }

  private validarParametros(params) {
    if (params.valor && params.tipo) {
      this.completarCampos(params);
      if (this.validarForm()) {
        this.obtenerEventos();
      } else { this._limpiar(); }
    }
  }

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoFiltro: new FormControl(null),
        liquidacion: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
        identificacion: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      }));

    this.onChanges();
    this.form.controls.tipoFiltro.setValue(1);
  }

  private onChanges() {
    this.form.controls.tipoFiltro.valueChanges.subscribe(tipoFiltro => {
      switch (tipoFiltro) {
        case 2:
          this.form.controls.liquidacion.enable();
          this.form.controls.identificacion.disable();
          this.form.controls.identificacion.reset();
          break;
        case 1:
          this.form.controls.liquidacion.disable();
          this.form.controls.liquidacion.reset();
          this.form.controls.identificacion.enable();
          break;
      }
    });
  }


  onLimpiar() {
    this.router.navigate([this.router.url.split('?')[0]], {});
    this.mostrarBotonNuevoEvento = false;
    this._limpiar();
  }

  _limpiar() {
    this.form.reset();
    this.initFormGroup();
    this.datosAsociado = null;
    this.mostrarBotonNuevoEvento = false;
    if (this.configuracion.gridEvento.component) {
      this.configuracion.gridEvento.component.limpiar();
    } else {
      this.configuracion.gridEvento.datos = [];
    }
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escucha el clik de la celta y devuelve el elemento de la celada y el dato
  */
  _onClickCeldaElement(event) {

    this.tipoConsulta = event.dato.tipoConsulta;

    if (event.col.key === 'more') {

      let listAccion = [];

      listAccion = this.frontService.scope.obtenerComponents('MM_CONSUL_RECLAMACIONES_ACCION')
        .map(x => ({ label: x.name, value: x.code, cssIcon: x.image }));

      if (event.dato.tipoReconocimiento === SIP_PARAMETROS_TIPO.TIPO_RECONOCIMIENTOS.SIP_PARAMRTROS.CANTIDAD_RENTAS) {
        this.configuracion.popupMenu.items = listAccion;
      }

      if (this.tipoConsulta === '2') {

        listAccion = listAccion.filter(x => x.value !== 'MM_CONSUL_RECLAMACIONES_ACCION_RENTAS');

        if (!event.dato.activa) {
          // El value hace referencia al tipo de acción que va a hacer el switch de la función _onClickItemPopup
          listAccion.push({ label: 'Activar solicitud', value: 'MM_ACTIVAR_SOLICITUD_EVENTO', cssIcon: 'icon-check-circle' });
        }

        if ((event.dato.recEstado !== MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.EN_PROCESO &&
          event.dato.recEstado !== MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.SUSPENDIDA) ||
          event.dato.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.NOTIFICAR_APROBACION) {
          listAccion = listAccion.filter(x => x.value !== 'MM_CONSUL_RECLAMACIONES_ACCION_ANULAR');
        }
      }

      this.configuracion.popupMenu.items = listAccion;
      this.configuracion.popupMenu.component.mostrar(event.e.x,
        event.e.y, event.dato);

    } else {
      if (this.tipoConsulta === '1') {
        this.translate.get('eventos.solicitudSipReclamaciones').subscribe(async texto => {
          this.frontService.alert.warning(texto);
        });
      } else if (this.tipoConsulta === '2') {
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_EVENTOS,
          this.asoNumInt,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
          event.dato.recCodigo,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DATOS_EVENTO
        ]);
      }
    }
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escucha cuando le dan click el evento item popupmenu
  */
  _onClickItemPopup(e) {
    switch (e.item.value) {
      case CodigosMenu.CONSULTAS_RECLAMACIONES_ACCION_BITACORA:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_EVENTOS,
          this.asoNumInt,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
          e.dato.recCodigo,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_BITACORA,
          this.tipoConsulta
        ]);
        break;
      case CodigosMenu.CONSULTAS_RECLAMACIONES_ACCION_RENTAS:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_EVENTOS,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_RENTAS,
          e.dato.recCodigo
        ], {
          queryParams: {
            valor: this.form.controls.liquidacion.enabled ?
              this.form.controls.liquidacion.value :
              this.form.controls.identificacion.value,
            tipo: this.form.controls.tipoFiltro.value
          }
        });
        break;
      case CodigosMenu.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_ACTIVAR:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_EVENTOS,
          this.asoNumInt,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
          e.dato.recCodigo,
          UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_ACTIVAR
        ]);
        break;
      case CodigosMenu.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_ANULAR:
        this.modalAnulacion(e.dato.recCodigo);
        break;
      case CodigosMenu.CONSULTAS_RECLAMACIONES_ACCION_OBSERVACIONES:
        this.modalObservacion(e.dato.recCodigo);
        break;
    }
  }

  modalObservacion(codigoSolicitudEvento: string): void {
    if (this.tipoConsulta === '2') {
      this.idProceso = codigoSolicitudEvento;

      this.backService.solicitudEvento.getSolicitudEvento(this.idProceso).subscribe(items => {
        this.solicitudEvento = items
      })

    }

    this._isLoad = Promise.resolve(true);
    this.mostrarModalObservaciones = true;
  }



  guardarObservacion():void {
    const controlComentario: AbstractControl = this.formObservacion.controls.controlObservacion;
    const comentario: string = this.formObservacion.controls.controlObservacion.value;

    if(comentario !== null && comentario.indexOf(' ') && controlComentario.valid) {
      const datosObservacion = {
        type: GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO,
        message: comentario
      };

      this.backService.proceso.guardarComentario(this.idProceso, datosObservacion).subscribe(res => {
        this.frontService.alert.success("La observación se guardo con éxito!").then(() => {
          this.formObservacion.reset();
          this.habilitarGuardar = true;
          this._isLoad = Promise.resolve(false);
          this.mostrarModalObservaciones = false;
          this.popupMenu.ocultar();
        });
      })
    }

  }


  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }
    return true;
  }

  cancelarObservacion(): void {
    this.mostrarModalObservaciones = false;
    this.formObservacion.reset();
  }

  onBuscar($event) {
    this.mostrarBotonNuevoEvento = false;
    if (!this.validarForm()) {
      return;
    }
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        valor: this.form.controls.liquidacion.enabled ? this.form.controls.liquidacion.value : this.form.controls.identificacion.value,
        tipo: this.form.controls.tipoFiltro.value,
        radicacion: this.radicacion
      }
    });

  }

  obtenerEventos() {
    this.datosAsociado = null;
    this.mostrarBotonNuevoEvento = false;
    const tipoFiltro = this.form.controls.tipoFiltro.value;

    if (this.configuracion.gridEvento.component) {
      this.configuracion.gridEvento.component.limpiar();
    } else {
      this.configuracion.gridEvento.datos = [];
    }

    const filtrosReclamaciones: any = {
      estados: this.estados.join(',')
    };

    const filtrosSolicitudEvento: any = {};

    if (tipoFiltro === 1) {
      const identificacion = this.form.controls.identificacion.value;
      filtrosReclamaciones.nitCli = identificacion;

      this.backService.asociado.buscarAsociado({ nitCli: identificacion, isPaged: true, page: 0, size: 1 })
        .subscribe(respuesta => {
          if (!respuesta || !respuesta.content || respuesta.content.length === 0) {
            this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
              this.frontService.alert.info(response);
            });
          } else {
            this.datosAsociado = respuesta.content[0];
            filtrosSolicitudEvento.asoNumInt = this.datosAsociado.numInt;
            this._consultaEventos(filtrosReclamaciones, filtrosSolicitudEvento);
          }
        }, err => {
          this.frontService.alert.warning(err.error.message);
        });
    } else if (this.form.controls.tipoFiltro.value === 2) {
      const codigoEvento = this.form.controls.liquidacion.value;
      filtrosReclamaciones.recCodigo = codigoEvento;
      filtrosSolicitudEvento.codigo = codigoEvento;
      this._consultaEventos(filtrosReclamaciones, filtrosSolicitudEvento);
    }
  }

  _consultaEventos(filtrosReclamaciones: any, filtrosSolicitudEvento: any) {

    forkJoin({
      _reclamaciones: this.backService.reclamaciones.getReclamaciones(filtrosReclamaciones),
      _solicitudesEvento: this.backService.solicitudEvento.getSolicitudesEvento(filtrosSolicitudEvento),
    }).pipe(
      map((x: any) => {
        return {
          _codigosSolicitudEvento: x._solicitudesEvento.content.map(j => j.codigo),
          _respuesta:
            [
              ...x._reclamaciones.content.map(t => {
                return {
                  ...t,
                  asignadoA: t.asignadoA ? t.asignadoA.name : '',
                  tipoConsulta: '1' // SipReclamaciones
                };
              }),
              ...x._solicitudesEvento.content.map(t => {
                return {
                  recCodigo: t.codigo,
                  asoNumInt: t.asoNumInt,
                  recFechaEvento: t.fechaEvento,
                  diagCod: null,
                  recLateralidadNombre: null,
                  recEstado: t.mimEstadoSolicitudEvento.codigo,
                  codFaseFlujo: t.mimFaseFlujo.codigo,
                  recEstadoNombre: t.mimEstadoSolicitudEvento.codigo === MIM_PARAMETROS.MIM_ESTADOS_SOLICITUD_EVENTO.EN_PROCESO ?
                    t.mimFaseFlujo ? t.mimFaseFlujo.nombre : t.mimEstadoSolicitudEvento.nombre : t.mimEstadoSolicitudEvento.nombre,
                  recEstadoNombreCorto: t.mimEstadoSolicitudEvento.nombreCorto,
                  tipoAuxDescripcion: t.mimEvento.nombre,
                  tipoConsulta: '2' // MimEventoSolicitud
                };
              })
            ]
        };
      })
    ).subscribe((datos: any) => {

      this.asoNumInt = filtrosSolicitudEvento && filtrosSolicitudEvento.asoNumInt ?
        filtrosSolicitudEvento.asoNumInt : !datos._respuesta || !datos._respuesta.length ? null : datos._respuesta[0].asoNumInt;

      this._datosAsociado();

      // Validamos el contenido.
      if (!datos._respuesta || !datos._respuesta.length) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
        return;
      }

      datos._respuesta = datos._respuesta.sort((a, b) => {
        return <any>DateUtil.stringToDate(b.recFechaEvento) - <any>DateUtil.stringToDate(a.recFechaEvento);
      });

      // Se valida si trae datos de mimSolicitudEvento para que no consulte el runtime sin parametros
      if (datos._codigosSolicitudEvento.length > 0) {
        const parametro = {};
        parametro['actHiProcinst.id'] = datos._codigosSolicitudEvento;
        parametro['includeAssigneeInfo'] = true;

        // Se consultan los datos de los procesos
        this.backService.runtime.getRuntimeTasks(parametro).subscribe(datosProceso => {
          this.datoProceso = datosProceso.content;

          datos._respuesta.map(resp => {
            const registro = this.datoProceso.find(item => +item.processInstanceId === resp.recCodigo && resp.tipoConsulta === '2');
            const x = resp;
            x.asignadoA = registro && registro.userInfo ? registro.userInfo.name : '';
            x.activa = registro ? registro.active : true;
            return x;
          });

          this.configuracion.gridEvento.component.cargarDatos(
            datos._respuesta,
            {
              maxPaginas: Math.ceil(datos._respuesta.length / 10),
              pagina: 0,
              cantidadRegistros: datos._respuesta.length
            }
          );
        }, err => {
          this.frontService.alert.warning(err.error.message);
        });

        // Si solo trae datos de sipReclamaciones
      } else {
        this.configuracion.gridEvento.component.cargarDatos(
          datos._respuesta,
          {
            maxPaginas: Math.ceil(datos._respuesta.length / 10),
            pagina: 0,
            cantidadRegistros: datos._respuesta.length
          }
        );
      }

    }, err => {
      this.frontService.alert.warning(err.message);
    });
  }

  _datosAsociado() {
    // Configuramos los datos del asociado.
    if (this.asoNumInt !== null && this.asoNumInt !== undefined) {
      this.subs.push(this.dataService.asociados()
        .asociado.subscribe((datosAsociadoWrapper: DatosAsociadoWrapper) => {
          if (this.datosAsociado) {
            // Agregamos loa datos al data service.
            this.dataService.asociados().accion(Acciones.Publicar, this.datosAsociado, false);
          } else if (!datosAsociadoWrapper || datosAsociadoWrapper.datosAsociado.numInt !== this.asoNumInt) {
            this.dataService.asociados().accion(Acciones.Publicar, this.asoNumInt, true);
            return;
          }

          if (datosAsociadoWrapper) {
            this.datosAsociado = datosAsociadoWrapper.datosAsociado;
          }
          this.mostrarBotonNuevoEvento = this.radicacion;

        }));
    }
  }


  completarCampos(params: any) {
    this.form.patchValue({
      tipoFiltro: parseInt(params.tipo, 10),
      liquidacion: params.tipo === '2' ? params.valor : '',
      identificacion: params.tipo === '1' ? params.valor : ''
    });
    this.radicacion = params.radicacion ? true : false;
  }

  _nuevoEvento() {

    this.backService.solicitudEvento.getValidaRegistroSolicitudesEvento({ asoNumInt: this.asoNumInt })
      .subscribe(registrar => {
        if (registrar) {
          this.router.navigate([
            UrlRoute.PAGES,
            UrlRoute.CONSULTAS,
            UrlRoute.CONSULTAS_EVENTOS,
            this.asoNumInt,
            UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD,
          ]);

        } else {
          this.translate.get('eventos.amparoMuerte').subscribe(async texto => {
            this.frontService.alert.warning(texto).then(() => {
              this.router.navigate([UrlRoute.PAGES]);
            });
          });
        }

      });

  }

  initFormAnulacion() {
    this.isFormAnulacion = Promise.resolve(
      this.formAnulacion = this.formBuilder.group({
        causaAnulacion: new FormControl(null, Validators.required),
        usuarioAnulacion: new FormControl(null),
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(999), Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')])
      })
    );
    this.changeAnulacion();
  }

  changeAnulacion() {
    this.formAnulacion.controls.causaAnulacion.valueChanges.subscribe(razonAnulacion => {
      if (razonAnulacion) {
        if (razonAnulacion.codigo === MIM_PARAMETROS.MIM_RAZON_ANULACION.ERROR_USUARIO) {
          this.mostrarUsuariosAnulacion = true;
          this.formAnulacion.controls.usuarioAnulacion.setValidators([Validators.required]);
        } else {
          this.mostrarUsuariosAnulacion = false;
          this.formAnulacion.controls.usuarioAnulacion.setValidators(null);
          this.formAnulacion.controls.usuarioAnulacion.setValue(null);
        }
      }
    });
  }

  modalAnulacion(codigoSolicitudEvento: string) {

    if (this.tipoConsulta === '2') {
      this.idProceso = codigoSolicitudEvento;
      forkJoin({
        _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
        _usuarioAnulacion: this.backService.historyTask.getUsersHistoryTask(this.idProceso),
        _razonAnulacion: this.backService.razonAnulacion.getRazonesAnulacion({ estado: true, 'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.REGISTRO })
      }).pipe(
        map(x => {
          return {
            _solicitudEvento: x._solicitudEvento,
            _razonesAnulacion: x._razonAnulacion._embedded.mimRazonAnulacion,
            _usuariosAnulacion: x._usuarioAnulacion.map(t => {
              return {
                codigo: t.identification,
                nombre: t.name
              };
            })
          };
        })
      ).subscribe((items) => {
        this.solicitudEvento = items._solicitudEvento;
        this.usuariosAnulacion = items._usuariosAnulacion;
        this.razonesAnulacion = items._razonesAnulacion;
        this.mostrarModalAnulacion = true;
        this.habilitarGuardar = true;
        this.formAnulacion.reset();

      }, (err) => {
        this.frontService.alert.warning(err.error.message);
        this.mostrarModalAnulacion = false;
      });

    }
  }


  guardarAnulacion() {

    const _form = this.formAnulacion.getRawValue();
    const comentario = _form.observacion;
    const nombreProceso = this.solicitudEvento.mimEvento.nombreProceso;
    this.solicitudEvento.mimRazonAnulacion = { codigo: _form.causaAnulacion.codigo };
    this.solicitudEvento.usuarioErrorAnulacion = _form.usuarioAnulacion ? _form.usuarioAnulacion.codigo : null;
    this.habilitarGuardar = false;

    const datosAnular = {
      type: GENERALES.TIPO_COMENTARIO.ANULA,
      message: GENERALES.DES_FASES_FLUJO.ANULAR + comentario
    };

    this.datosFlujo = {};
    // Se envia el mismo id de proceso para que no saque error de obligatoriedad
    this.datosFlujo['taskId'] = this.idProceso;
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['mimSolicitudEvento'] = this.solicitudEvento;
    this.datosFlujo['variables'] = datosAnular;

    this.backService.solicitudEvento.postAnular(this.datosFlujo, nombreProceso).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.formAnulacion.reset();
          this.habilitarGuardar = true;
          this.mostrarModalAnulacion = false;
          this.popupMenu.ocultar();
          this.obtenerEventos();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  cancelarAnulacion() {
    this.mostrarModalAnulacion = false;
  }

}
