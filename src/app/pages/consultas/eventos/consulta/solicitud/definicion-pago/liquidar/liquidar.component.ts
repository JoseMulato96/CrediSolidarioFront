import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AlertService } from '@core/services';
import { DatosEventoService } from '../../services/datos-evento.service';
import { SolicitudEventoService } from '../../../../../../../core/services/api-back.services/mimutualreclamaciones/solicitud-evento.service';
import { IDefinicionPagoEvento } from '@shared/models/definicion-pago-evento.model';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-liquidar',
  templateUrl: './liquidar.component.html'
})
export class LiquidarComponent implements OnInit, OnDestroy {
  @Output() activaGuardar = new EventEmitter<any>();

  definicionPago: IDefinicionPagoEvento;
  datosFlujo: any;

  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly datosEventoService: DatosEventoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.definicionPago = this.datosEventoService.getDefinicionPago();
    this._initForm();
    this.activaGuardar.emit(true);
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({})
    );
  }

  _guardar() {
    this.activaGuardar.emit(false);
    this._guardarDatos();
  }

  _guardarDatos() {

    this.datosFlujo = {};

    this.datosFlujo['processInstanceId'] = this.definicionPago.procesoId;
    this.datosFlujo['taskId'] = this.definicionPago.tareaId;
    this.datosFlujo['mimSolicitudEvento'] = this.definicionPago.solicitudEvento;

    // Si la fase es liquidación o definición
    if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.LIQUIDACION) {
      this._guardarLiquidacion();
    // Si la fase es pago
    } else if (this.definicionPago.codFaseFlujo === MIM_PARAMETROS.MIM_FASE_FLUJO.PAGO) {
      this._guardarPago();
    }

  }

  _guardarLiquidacion() {
    const datosLiquida = {
      comment: GENERALES.DES_FASES_FLUJO.LIQUIDACION + this.definicionPago.observacion,
      devolucionErrorLiquidar: 'none',
      conceptoLiquidacionFavorable: true,
      otraArea: false
    };
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
      this.activaGuardar.emit(true);
      this.frontService.alert.error(err.error.message);
    });
  }

  _guardarPago() {
    const datosPago = {
      comment: GENERALES.DES_FASES_FLUJO.PAGO + this.definicionPago.observacion,
      devolucionErrorPago: 'none',
      conceptoPagoFavorable: true,
      otraArea: false
    };
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
      this.activaGuardar.emit(true);
      this.frontService.alert.error(err.error.message);
    });
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

}
