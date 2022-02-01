import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Router } from '@angular/router';
import { IDefinicionPagoEvento } from '@shared/models/definicion-pago-evento.model';
import { DatosEventoService } from '../../services/datos-evento.service';
import { MimGeneraCartaComponent } from '@shared/components/mim-genera-carta/mim-genera-carta.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-cobertura',
  templateUrl: './cobertura.component.html',
  styleUrls: ['./cobertura.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoberturaComponent implements OnInit {

  @ViewChild(MimGeneraCartaComponent) mimGeneraCartaComponent: MimGeneraCartaComponent;

  @Output() activaSiguiente = new EventEmitter<any>();
  @Output() activaGuardar = new EventEmitter<any>();
  @Output() irSiguiente = new EventEmitter<any>();

  definicionPago: IDefinicionPagoEvento;

  form: FormGroup;
  isForm: Promise<any>;

  datosFlujo: any;
  suspenderFlujo: boolean;
  conceptoFavorable: boolean;
  conceptoOtrasAreas: boolean;
  guardarComentario: boolean;
  labelRemedy: string;
  cartaDiligenciada: boolean;
  contenidoCarta: string;

  _conceptoFlujo: number;

  _envioCarta: boolean;
  _disabledObservacion: boolean;
  _datoCoberturaEvento: any;

  dataInitDevolverPorError: any;
  dataInitGestionPendientePor: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly datosEventoService: DatosEventoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.conceptoOtrasAreas = false;
  }

  ngOnInit() {

    this.translate.get('eventos.consulta.solicitud.numeroRemedy').subscribe((text: string) => {
      this.labelRemedy = text;
    });

    this.definicionPago = this.datosEventoService.getDefinicionPago();
    this.dataInitGestionPendientePor = this.definicionPago.subestados;
    this.dataInitDevolverPorError = {
      fases: this.definicionPago.fasesFlujo,
      razonesDevolucion: null
    };
    this._initForm();
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        devolverPorError: this.formBuilder.group({
          fasesFlujo: [null],
          razonDevolucion: [null]
        }),
        gestionPendientePor: this.formBuilder.group({
          subestados: [null],
          numeroRemedy: [null]
        })
      })
    );
    this.form.controls.gestionPendientePor['controls'].numeroRemedy.disable();
    this.form.controls.devolverPorError['controls'].fasesFlujo.disable();
    this.form.controls.devolverPorError['controls'].razonDevolucion.disable();
    this.changeGestionPendientePor();
    this._mostrarBotones();
  }

  changeGestionPendientePor() {

    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    gestionPendientePor.subestados.valueChanges.subscribe(item => {
      if (item) {

        this.conceptoOtrasAreas = item.mimTipoGestion.codigo === GENERALES.TIPO_GESTION.CONCEPTO_OTRAS_AREAS ? true : false;
        this.guardarComentario = item.mimTipoGestion.codigo === GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO ? true : false;


        if (item.codigo === GENERALES.MIM_SUBESTADOS.REMEDY) {
          gestionPendientePor.numeroRemedy.setValidators([Validators.required]);
          gestionPendientePor.numeroRemedy.enable();
        } else {
          gestionPendientePor.numeroRemedy.setValidators(null);
          gestionPendientePor.numeroRemedy.setValue(null);
          gestionPendientePor.numeroRemedy.disable();
        }

        this._mostrarBotones();

      } else {
        return;
      }
    });
  }

  _mostrarBotones() {

    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    const devolucionPorError = this.form.controls.devolverPorError['controls'];

    if (this._envioCarta) {
      this.activaSiguiente.emit(false);

      if (this.definicionPago.observacion && this.contenidoCarta !== null
        && this.contenidoCarta !== undefined && this.contenidoCarta !== '') {
        this.activaGuardar.emit(true);
      } else {
        this.activaGuardar.emit(false);
      }

    } else {
      if (this.definicionPago.observacion) {

        if (devolucionPorError.fasesFlujo.value || gestionPendientePor.subestados.value) {

          this.activaSiguiente.emit(false);

          if (gestionPendientePor.subestados.value && gestionPendientePor.subestados.value.codigo === GENERALES.MIM_SUBESTADOS.REMEDY) {
            if (gestionPendientePor.numeroRemedy.value) {
              this.activaGuardar.emit(true);
            } else {
              this.activaGuardar.emit(false);
            }

          } else {
            this.activaGuardar.emit(true);
          }

        } else {

          this.activaGuardar.emit(false);

          if (this.conceptoFavorable) {
            this.activaSiguiente.emit(true);
          } else {
            this.activaSiguiente.emit(false);
          }
        }

      } else {
        this.activaSiguiente.emit(false);
        this.activaGuardar.emit(false);
      }
    }
  }

  _siguiente() {
    this.irSiguiente.emit(true);
  }

  _guardar() {

    const devolucionPorError = this.form.controls.devolverPorError['controls'];
    const codigoDevolucionError = devolucionPorError.fasesFlujo.value ? devolucionPorError.fasesFlujo.value.codigo : 0;

    const faseDevolucionError = this._faseDevolucionError(codigoDevolucionError);

    this.datosFlujo = {};
    this.definicionPago.liquidacionEvento.observaciones = this.definicionPago.observacion;

    this.datosFlujo['processInstanceId'] = this.definicionPago.procesoId;
    this.datosFlujo['taskId'] = this.definicionPago.tareaId;
    this.datosFlujo['mimSolicitudEvento'] = this.definicionPago.solicitudEvento;

    // Si la fase es liquidación o definición
    if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.LIQUIDACION) {
      this._guardarLiquidacion(faseDevolucionError);
    // Si la fase es pago
    } else if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.PAGO) {
      this._guardarPago(faseDevolucionError);
    }

  }

  _guardarLiquidacion(faseDevolucionError: any) {

    let datosLiquida = {};
    let comentario = GENERALES.DES_FASES_FLUJO.LIQUIDACION + this.definicionPago.observacion;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];

    // Si se suspende el flujo
    if (this.suspenderFlujo) {
      datosLiquida = {
        type: GENERALES.TIPO_COMENTARIO.SUSPENDIDO,
        message: comentario,
        contenidoCarta: this.contenidoCarta
      };

      // Si se devuelve por error o se envia a negación el flujo o se envia a concepto otras áreas
    } else {

      // Si se envía a concepto otras áreas
      if (this.conceptoOtrasAreas) {

        datosLiquida = {
          otraArea: this.conceptoOtrasAreas,
          areaDesignada: gestionPendientePor.subestados.value.codigo,
          comment: comentario
        };

        // Si se devuelve por error o se envia a negación el flujo o se guarda comentario
      } else {

        // Si viene de gestión pendiente para guardar comentario
        if (this.guardarComentario) {

          if (gestionPendientePor.numeroRemedy.value) {
            const comnentarioRemedy = [this.labelRemedy, gestionPendientePor.numeroRemedy.value, comentario];
            comentario = comnentarioRemedy.join(' ');
          }

          datosLiquida = {
            type: GENERALES.TIPO_COMENTARIO.GESTION,
            message: comentario
          };

        } else {
          datosLiquida = {
            devolucionErrorLiquidar: faseDevolucionError,
            conceptoLiquidacionFavorable: this.conceptoFavorable,
            otraArea: this.conceptoOtrasAreas,
            comment: comentario,
            contenidoCarta: this.contenidoCarta
          };
        }

      }

    }

    this.datosFlujo['variables'] = datosLiquida;
    this.datosFlujo['mimLiquidacion'] = this.definicionPago.liquidacionEvento;

    const nombreProceso = this.definicionPago.solicitudEvento.mimEvento.nombreProceso;
    this.backService.solicitudEvento.postLiquidar(this.datosFlujo, nombreProceso).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES]);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _guardarPago(faseDevolucionError: any) {

    let datosPago = {};
    let comentario = GENERALES.DES_FASES_FLUJO.PAGO + this.definicionPago.observacion;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];

    // Si se suspende el flujo
    if (this.suspenderFlujo) {
      datosPago = {
        type: GENERALES.TIPO_COMENTARIO.SUSPENDIDO,
        message: comentario,
        contenidoCarta: this.contenidoCarta
      };

      // Si se devuelve por error o se envia a negación el flujo o se guarda comentario
    } else {

      // Si viene de gestión pendiente para guardar comentario
      if (this.guardarComentario) {

        if (gestionPendientePor.numeroRemedy.value) {
          const comnentarioRemedy = [this.labelRemedy, gestionPendientePor.numeroRemedy.value, comentario];
          comentario = comnentarioRemedy.join(' ');
        }

        datosPago = {
          type: GENERALES.TIPO_COMENTARIO.GESTION,
          message: comentario
        };

        // Si se devuelve por error o se envia a negación el flujo
      } else {
        datosPago = {
          devolucionErrorPago: faseDevolucionError,
          conceptoPagoFavorable: this.conceptoFavorable,
          otraArea: this.conceptoOtrasAreas,
          comment: comentario,
          contenidoCarta: this.contenidoCarta
        };
      }
    }

    this.datosFlujo['variables'] = datosPago;
    this.datosFlujo['mimLiquidacion'] = this.definicionPago.liquidacionEvento;

    const nombreProceso = this.definicionPago.solicitudEvento.mimEvento.nombreProceso;
    this.backService.solicitudEvento.postPagar(this.datosFlujo, nombreProceso).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES]);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _faseDevolucionError(codigo: number) {

    let faseDevolucion = '';
    switch (codigo) {
      case 1:
        faseDevolucion = 'radicacion';
        break;
      case 2:
        faseDevolucion = 'auditoriaMedica';
        break;
      case 3:
        faseDevolucion = 'liquidacion';
        break;
      default:
        faseDevolucion = 'none';
        break;
    }
    return faseDevolucion;
  }

  _conceptoCobertura(datoCobertura: any) {

    let nuevoEventoDetalle: any = {};
    let registroFavorable = {};
    let registroDesfavorable = {};
    let registroSolicitudInformacion = {};
    let registroDevolucionError = {};

    // Si la fase es liquidación o definición
    if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.LIQUIDACION) {

      nuevoEventoDetalle = this.definicionPago.solicitudEvento.mimSolicitudEventoDetalleList.map(detalle => {
        if (detalle.codigoPlan === datoCobertura.codigoPlan &&
          detalle.codigoCobertura === datoCobertura.codigoCobertura) {
          detalle.mimConceptoDefinicion = datoCobertura.conceptoTareaFlujo;
          detalle.mimRazonNegacionDefinicion = datoCobertura.razonNegacion;
          this._conceptoFlujo = datoCobertura.conceptoTareaFlujo.codigo;
        }
        return detalle;
      });

      // Se realiza de esta forma porque por ahora solo trae un registro
      registroFavorable = nuevoEventoDetalle.find(
        item => item.mimConceptoDefinicion.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_DEFINICION_FAVORABLE);
      registroDesfavorable = nuevoEventoDetalle.find(
        item => item.mimConceptoDefinicion.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_DEFINICION_DESFAVORABLE);
      registroSolicitudInformacion = nuevoEventoDetalle.find(
        item => item.mimConceptoDefinicion.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_DEFINICION_SOLICITUD_INFORMACION);
      registroDevolucionError = nuevoEventoDetalle.find(
        item => item.mimConceptoDefinicion.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_DEFINICION_DEVOLUCION_ERROR);
    // Si la fase es pago
    } else if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.PAGO) {

      nuevoEventoDetalle = this.definicionPago.solicitudEvento.mimSolicitudEventoDetalleList.map(detalle => {
        if (detalle.codigoPlan === datoCobertura.codigoPlan &&
          detalle.codigoCobertura === datoCobertura.codigoCobertura) {
          detalle.mimConceptoDirector = datoCobertura.conceptoTareaFlujo;
          detalle.mimRazonNegacionDirector = datoCobertura.razonNegacion;
          this._conceptoFlujo = datoCobertura.conceptoTareaFlujo.codigo;
        }
        return detalle;
      });

      // Se realiza de esta forma porque por ahora solo trae un registro
      registroFavorable = nuevoEventoDetalle.find(
        item => item.mimConceptoDirector.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_PAGO_FAVORABLE);
      registroDesfavorable = nuevoEventoDetalle.find(
        item => item.mimConceptoDirector.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_PAGO_DESFAVORABLE);
      registroSolicitudInformacion = nuevoEventoDetalle.find(
        item => item.mimConceptoDirector.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_PAGO_SOLICITUD_INFORMACION);
      registroDevolucionError = nuevoEventoDetalle.find(
        item => item.mimConceptoDirector.codigo === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_PAGO_DEVOLUCION_ERROR);

    }

    // Limpiamos la carta solo si cambio el concepto.
    if (datoCobertura.cambioConcepto) {
      this.limpiarCarta();
    }
    this.mimGeneraCartaComponent.cargarDatos(this._conceptoFlujo);

    // Se actualiza la variable global
    this.definicionPago.solicitudEvento.mimSolicitudEventoDetalleList = nuevoEventoDetalle;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    const devolucionPorError = this.form.controls.devolverPorError['controls'];

    gestionPendientePor.subestados.setValidators(null);
    gestionPendientePor.subestados.setValue(null);
    gestionPendientePor.subestados.disable();

    gestionPendientePor.numeroRemedy.setValidators(null);
    gestionPendientePor.numeroRemedy.setValue(null);
    gestionPendientePor.numeroRemedy.disable();

    devolucionPorError.fasesFlujo.setValidators(null);
    devolucionPorError.fasesFlujo.setValue(null);
    devolucionPorError.fasesFlujo.disable();

    if (registroFavorable) {
      this.conceptoFavorable = true;
      this.suspenderFlujo = false;
      this._envioCarta = false;
    }

    if (registroDesfavorable) {
      this.conceptoFavorable = false;
      this.suspenderFlujo = false;
      this._envioCarta = true;
    }

    if (registroSolicitudInformacion) {
      this.conceptoFavorable = false;
      this.suspenderFlujo = true;
      this._envioCarta = true;
    }

    if (registroDevolucionError) {
      this.conceptoFavorable = false;
      this.suspenderFlujo = false;
      this._envioCarta = false;

      devolucionPorError.fasesFlujo.setValidators([Validators.required]);
      devolucionPorError.fasesFlujo.enable();

    }

    if (!registroFavorable && !registroDesfavorable && !registroSolicitudInformacion && !registroDevolucionError) {
      this.conceptoFavorable = false;
      this.suspenderFlujo = false;
      this._envioCarta = false;

      gestionPendientePor.subestados.setValidators([Validators.required]);
      gestionPendientePor.subestados.enable();

    }

    this.limpiarVariables();
    this._mostrarBotones();

  }

  private limpiarCarta() {
    this.mimGeneraCartaComponent.limpiar();
    this.contenidoCarta = null;
  }

  limpiarVariables() {
    this.conceptoOtrasAreas = false;
    this.guardarComentario = false;
    this.cartaDiligenciada = false;
  }

  datoObservacion(event) {
    this.definicionPago.observacion = event;
    this._mostrarBotones();
  }

  datoCoberturaEvento(event) {
    this._datoCoberturaEvento = event;
    this._conceptoCobertura(this._datoCoberturaEvento);
  }

  cartaGenerada(event) {
    this.cartaDiligenciada = true;
    this._disabledObservacion = false;
    this.contenidoCarta = event;
    this._mostrarBotones();
  }

}
