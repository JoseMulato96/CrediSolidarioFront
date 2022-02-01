import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { IValoresEvento } from '@shared/models/valores-evento.model';
import { MimValoresEventoComponent } from '@shared/components/mim-valores-evento/mim-valores-evento.component';
import { IDefinicionPagoEvento } from '@shared/models/definicion-pago-evento.model';
import { DatosEventoService } from '../../services/datos-evento.service';
import { MimDetalleEventoComponent } from '@shared/components/mim-detalle-evento/mim-detalle-evento.component';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';


@Component({
  selector: 'app-valor-pagar',
  templateUrl: './valor-pagar.component.html'
})
export class ValorPagarComponent implements OnInit {

  @ViewChild(MimValoresEventoComponent, { static: false }) valoresEventoComponent: MimValoresEventoComponent;
  @ViewChild(MimDetalleEventoComponent) mimDetalleEventoComponent: MimDetalleEventoComponent;

  @Output() activaSiguiente = new EventEmitter<any>();
  @Output() activaGuardar = new EventEmitter<any>();
  @Output() irSiguiente = new EventEmitter<any>();
  @Output() irAtras = new EventEmitter<any>();

  definicionPago: IDefinicionPagoEvento;

  datosFlujo: any;
  conceptoOtrasAreas: boolean;
  guardarComentario: boolean;
  labelRemedy: string;

  form: FormGroup;
  isForm: Promise<any>;

  _guardarValores: IValoresEvento;

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
    this.dataInitDevolverPorError = { fases: this.definicionPago.fasesFlujo, razonesDevolucion: null };
    this._initForm();
  }

  _getSimulacionLiquidacion() {
    this.backService.liquidacion.postSimularLiquidacionEvento(this.definicionPago.solicitudEvento).subscribe(respuesta => {
      this.definicionPago.liquidacionEvento = respuesta;
      if (this.definicionPago.codigoLiquidacion !== null) {
        this.definicionPago.liquidacionEvento.codigo = this.definicionPago.codigoLiquidacion;
        const nuevoLiquidacionDetalle = this.definicionPago.liquidacionEvento.mimLiquidacionDetalleList.map(detalle => {
          detalle.mimLiquidacionDetallePK.codigoLiquidacion = this.definicionPago.codigoLiquidacion;
          return detalle;
        });

        // Se actualiza la variable global
        this.definicionPago.liquidacionEvento.mimLiquidacionDetalleList = nuevoLiquidacionDetalle;
      }
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
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
    if (this.definicionPago.observacion) {

      const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
      const devolucionPorError = this.form.controls.devolverPorError['controls'];

      if (devolucionPorError.fasesFlujo.value  || gestionPendientePor.subestados.value) {

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
        this.activaSiguiente.emit(true);
        this.activaGuardar.emit(false);
      }

    } else {
      this.activaSiguiente.emit(false);
      this.activaGuardar.emit(false);
    }
  }

  _llenarDatos() {
    // Se actualizan los datos en solicitud evento
    this._getSolicitudEvento();
    this.definicionPago.liquidacionEvento.observaciones = this.definicionPago.observacion;
    // Se actualiza la variable global
    this.definicionPago.valoresEvento = this._guardarValores;
  }

  _siguiente() {

    this._guardarValores = this.valoresEventoComponent._enviarData();

    if (this._guardarValores) {
      this._llenarDatos();
      if (this.definicionPago.liquidacionEvento.valorTotalPago > 0 &&
        this.definicionPago.liquidacionEvento.valorNetoPago > -1) {
        this.irSiguiente.emit(true);
      } else {
        this.irSiguiente.emit(false);
        this.translate.get('global.valorBaseCero').subscribe(async texto => {
          this.frontService.alert.warning(texto);
        });
      }
    } else {
      this.irSiguiente.emit(false);
    }
  }

  _guardar() {

    this._llenarDatos();

    const devolucionPorError = this.form.controls.devolverPorError['controls'];
    const codigoDevolucionError = devolucionPorError.fasesFlujo.value ? devolucionPorError.fasesFlujo.value.codigo : 0;
    const faseDevolucionError = this._faseDevolucionError(codigoDevolucionError);

    this.datosFlujo = {};

    this.datosFlujo['processInstanceId'] = this.definicionPago.procesoId;
    this.datosFlujo['taskId'] = this.definicionPago.tareaId;
    this.datosFlujo['mimSolicitudEvento'] = this.definicionPago.solicitudEvento;

    // Si la fase es liquidación
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
    // Si se envía a concepto otras áreas
    if (this.conceptoOtrasAreas) {

      datosLiquida = {
        otraArea: this.conceptoOtrasAreas,
        areaDesignada: gestionPendientePor.subestados.value.codigo,
        comment: comentario
      };

      // Si se devuelve por error o guarda comentario
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
          conceptoLiquidacionFavorable: true,
          otraArea: this.conceptoOtrasAreas,
          comment: comentario
        };
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

      // Si se devuelve por error
    } else {

      datosPago = {
        devolucionErrorPago: faseDevolucionError,
        conceptoPagoFavorable: true,
        otraArea: this.conceptoOtrasAreas,
        comment: comentario
      };
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

  _getSolicitudEvento() {

    if (this._guardarValores) {
      this.definicionPago.solicitudEvento.mimFormaPago = this._guardarValores.formaPago || null;
      this.definicionPago.solicitudEvento.descuentoSaldosVencidos = this._guardarValores.saldoVencido;
      this.definicionPago.solicitudEvento.descuentoCuotaMes = this._guardarValores.cuotaMes;
      this.definicionPago.solicitudEvento.oficinaGiro = this._guardarValores.oficina;
      this.definicionPago.solicitudEvento.numeroCuentaDeposito = this._guardarValores.numeroCuenta || null;
      this.definicionPago.solicitudEvento.valorSolicitado = this._guardarValores.valorSolicitado;
      this.definicionPago.solicitudEvento.mimBanco = this._guardarValores.banco || null;
      this.definicionPago.solicitudEvento.mimTipoCuentaBanco = this._guardarValores.tipoCuenta || null;
      this.definicionPago.solicitudEvento.codigoRetencionEvento = this._guardarValores.retencionEvento || null;
      this.definicionPago.solicitudEvento.mimTipoBeneficiarioPago = this._guardarValores.pagarA;
      this.definicionPago.solicitudEvento.abonaCredito = this._guardarValores.abonaCredito;
    }

  }

  _detalleEvento(datoDetalleEvento: any) {

    if (datoDetalleEvento.superaTope) {
      this.translate.get('global.superaTopesAnualidad').subscribe(async texto => {
        this.frontService.alert.warning(texto).then(() => {
          // Devolver a la pantalla anterior
          this.irAtras.emit(true);
        });
      });
    } else {
      const nuevoEventoDetalle = this.definicionPago.solicitudEvento.mimSolicitudEventoDetalleList
        .map(detalle => {
          if (detalle.codigoPlan === datoDetalleEvento.codigoPlan && detalle.codigoCobertura === datoDetalleEvento.codigoCobertura) {
            detalle.valorProteccionBase = datoDetalleEvento.valorProteccionBase;
          }
          return detalle;
        });

      // Se actualiza la variable global
      this.definicionPago.solicitudEvento.mimSolicitudEventoDetalleList = nuevoEventoDetalle;
      this._getSimulacionLiquidacion();
    }
  }

  datoObservacion(event) {
    this.definicionPago.observacion = event;
    this._mostrarBotones();
  }

  datoDetalleEvento(event) {
    this._detalleEvento(event);
  }

  vlrCuotaMensual(event) {
    this.definicionPago.solicitudEvento.descuentoCuotaMes = event;
    this.mimDetalleEventoComponent._validarValorBase();
  }

  vlrSaldosVencidos(event) {
    this.definicionPago.solicitudEvento.descuentoSaldosVencidos = event;
    this.mimDetalleEventoComponent._validarValorBase();
  }

  vlrDeduccionesVarias(event) {
    this.definicionPago.solicitudEvento.abonaCredito = event;
    this.mimDetalleEventoComponent._validarValorBase();
  }

}
