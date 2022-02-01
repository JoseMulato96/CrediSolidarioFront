import { Component, OnInit, OnDestroy, ViewEncapsulation, forwardRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, forkJoin } from 'rxjs';
import { ObjectUtil } from '@shared/util/object.util';
import { TranslateService } from '@ngx-translate/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { Acciones } from '@core/store/acciones';
import { IDefinicionPagoEvento, DefinicionPagoEvento } from '@shared/models/definicion-pago-evento.model';
import { GENERALES } from '@shared/static/constantes/constantes';
import { DatosEventoService } from '../services/datos-evento.service';
import { ValorPagarComponent } from './valor-pagar/valor-pagar.component';
import { CoberturaComponent } from './cobertura/cobertura.component';
import { LiquidarComponent } from './liquidar/liquidar.component';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-definicion-pago',
  templateUrl: './definicion-pago.component.html',
  styleUrls: ['./definicion-pago.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DefinicionPagoComponent),
      multi: true
    }
  ]
})
export class DefinicionPagoComponent implements OnInit, OnDestroy {

  @ViewChild(CoberturaComponent) coberturaComponent: CoberturaComponent;
  @ViewChild(ValorPagarComponent) valorPagarComponent: ValorPagarComponent;
  @ViewChild(LiquidarComponent) liquidarComponent: LiquidarComponent;

  _subs: Subscription[] = [];

  mostrarBitacora: boolean;

  items: MenuItem[];
  activeIndex = 0;

  habilitarSiguiente: boolean;
  habilitarGuardar: boolean;
  irSiguiente: boolean;
  irAtras: boolean;

  definicionPago: IDefinicionPagoEvento;
  datosAsociado: any;
  liquidacion: any;
  codFaseFlujo: number;
  rutaFaseFlujo: string;
  tipoFaseFlujo: string;
  asoNumInt: string;
  idProceso: string;
  idTarea: string;
  valoresAPagar: any;
  totalValorBase: number;
  devolucionError: any;
  deshabilitarGestionar: boolean;

  constructor(
    private readonly translate: TranslateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dataService: DataService,
    private readonly datosEventoService: DatosEventoService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    this.mostrarBitacora = true;
    this.deshabilitarGestionar = false;
  }

  ngOnInit() {

    this.definicionPago = new DefinicionPagoEvento();
    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    // Se agrega nuevo el llamado
    this._subs.push(this.route.params.subscribe((params) => {

      this.rutaFaseFlujo = params.rutaFaseFlujo;
      this.idProceso = params.idProceso;

      // Si la fase es definición
      if (this.rutaFaseFlujo === UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_DEFINICION) {
        this.devolucionError = [
          MIM_PARAMETROS.MIM_FASE_FLUJO.RADICACION,
          MIM_PARAMETROS.MIM_FASE_FLUJO.AUDITORIA_MEDICA
        ];
        this.codFaseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.LIQUIDACION;
        this.tipoFaseFlujo = GENERALES.TIPO_FASE_FLUJO.LIQUIDACION;
        // Si la fase es pago
      } else if (this.rutaFaseFlujo === UrlRoute.CONSULTAS_EVENTOS_CONSULTA_SOLICITUD_PAGO) {
        this.devolucionError = [
          MIM_PARAMETROS.MIM_FASE_FLUJO.RADICACION,
          MIM_PARAMETROS.MIM_FASE_FLUJO.AUDITORIA_MEDICA,
          MIM_PARAMETROS.MIM_FASE_FLUJO.LIQUIDACION
        ];
        this.codFaseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.PAGO;
        this.tipoFaseFlujo = GENERALES.TIPO_FASE_FLUJO.PAGO;
      } else {
        this.translate.get('global.paginaNoExiste').subscribe(async texto => {
          this.frontService.alert.warning(texto).then(() => {
            this.router.navigate([UrlRoute.PAGES]);
          });
        });
      }
      this.definicionPago.asoNumInt = this.asoNumInt;
      this.definicionPago.procesoId = this.idProceso;
      this.definicionPago.codFaseFlujo = this.codFaseFlujo;
      this._getInitDatos();
    }));

  }

  _getInitDatos() {

    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _liquidacion: this.backService.liquidacion.getLiquidacionesEvento({ 'mimSolicitudEvento.codigo': this.idProceso }),
      _valorAPagar: this.backService.solicitudEvento.getValorBase({ 'codigoSolicitudEvento': this.idProceso }),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso),
      _subestados: this.backService.faseSubestado.getFasesSubestados({ codigoFaseFlujo: this.tipoFaseFlujo }),
      _faseFlujo: this.backService.faseFlujo.getFaseFlujo({ codigo: this.devolucionError }),
    }).subscribe(items => {

      this.idTarea = items._tarea[0].taskId;
      this.definicionPago.solicitudEvento = items._solicitudEvento;
      this.definicionPago.codigoSublimite = items._solicitudEvento.mimSublimiteCobertura ? items._solicitudEvento.mimSublimiteCobertura.codigo : null;
      this.valoresAPagar = items._valorAPagar;

      if (items._liquidacion && items._liquidacion.content && items._liquidacion.content.length > 0) {
        this.definicionPago.codigoLiquidacion = items._liquidacion.content[0].codigo;
      }

      this.backService.liquidacion.postSimularLiquidacionEvento(items._solicitudEvento).subscribe(respuesta => {
        this.liquidacion = respuesta;
        if (this.definicionPago.codigoLiquidacion !== null) {
          this.liquidacion.codigo = this.definicionPago.codigoLiquidacion;
        }

        const nuevoLiquidacionDetalle = this.liquidacion.mimLiquidacionDetalleList.map(detalle => {

          if (this.definicionPago.codigoLiquidacion !== null) {
            detalle.mimLiquidacionDetallePK.codigoLiquidacion = this.definicionPago.codigoLiquidacion;
          }

          const datoValorAPagar = this._setValoresAPagar(detalle.mimLiquidacionDetallePK.codigoPlan,
            detalle.mimLiquidacionDetallePK.codigoCobertura);

          // Si la cobertura seleccionada tiene un sublimite
          if (this.definicionPago.codigoSublimite) {

            const valorProteccionBaseSublimite = datoValorAPagar.valorProteccionBaseSublimite;
            if (valorProteccionBaseSublimite > 0) {
              if (detalle.valorProteccionBase > valorProteccionBaseSublimite) {
                detalle.valorProteccionBase = valorProteccionBaseSublimite;
              }
            } else {
              detalle.valorProteccionBase = 0;
            }

            // Si la cobertura seleccionada NO tiene un sublimite
          } else {
            const valorProteccionBaseSinSublimite = datoValorAPagar.valorProteccionBaseSinSublimite;
            if (valorProteccionBaseSinSublimite > 0) {
              if (detalle.valorProteccionBase > valorProteccionBaseSinSublimite) {
                detalle.valorProteccionBase = valorProteccionBaseSinSublimite;
              }
            } else {
              detalle.valorProteccionBase = 0;
            }
          }

          this.totalValorBase = + detalle.valorProteccionBase;

          return detalle;
        });
        // Se actualiza la variable global
        this.liquidacion.mimLiquidacionDetalleList = nuevoLiquidacionDetalle;

        // Se recalculan los valores en caso de que se supere el tope
        this.liquidacion.valorTotalPago = this.totalValorBase;
        this.liquidacion.valorNetoPago = this.totalValorBase - this.liquidacion.valorTotalDeducciones;

        this.definicionPago.liquidacionEvento = this.liquidacion;
        this.definicionPago.valorAPagar = this.valoresAPagar;
        this.definicionPago.tareaId = this.idTarea;
        this.definicionPago.subestados = items._subestados.map(y => y.mimSubestado);
        this.definicionPago.subestados.unshift({ codigo: null, nombre: 'Seleccionar' });
        this.definicionPago.fasesFlujo = items._faseFlujo._embedded.mimFaseFlujo || null;
        this._datosAsociado();
        this.datosEventoService.setDefinicionPago(this.definicionPago);
        this._asignacionReducer();

      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    }, (err) => {
      this.deshabilitarGestionar = true;
      this.frontService.alert.error(err.error.message);
    });

  }

  _datosAsociado() {
    // Configuramos los datos del asociado.
    if (this.asoNumInt !== null && this.asoNumInt !== undefined) {
      this._subs.push(this.dataService
        .asociados()
        .asociado.subscribe((datosAsociadoWrapper: DatosAsociadoWrapper) => {
          if (
            !datosAsociadoWrapper ||
            datosAsociadoWrapper.datosAsociado.numInt !== this.asoNumInt
          ) {
            this.dataService
              .asociados()
              .accion(Acciones.Publicar, this.asoNumInt, true);
            return;
          }
          this.datosAsociado = datosAsociadoWrapper.datosAsociado;
          this.definicionPago.datosAsociado = this.datosAsociado;

        }));
    }
  }

  _asignacionReducer() {
    this.items = [{
      label: 'eventos.consulta.solicitud.liquidacionPago.cobertura.titulo',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'eventos.consulta.solicitud.liquidacionPago.valorPagar.titulo',
      command: async (event: any) => {
        this.activeIndex = 1;
      }
    },
    {
      label: 'eventos.consulta.solicitud.liquidacionPago.liquidar.titulo',
      command: async (event: any) => {
        this.activeIndex = 2;
      }
    }
    ];
    ObjectUtil.traducirObjeto(this.items, this.translate);
  }

  _esPasoInicial(): boolean {
    return this.activeIndex === 0;
  }

  _esPasoFinal(): boolean {
    if (this.items) {
      return this.activeIndex === this.items.length - 1;
    }
    return false;
  }

  _atras() {
    if (this._esPasoInicial()) {
      return;
    }

    this.habilitarGuardar = false;
    const anteriorPosicion = this.activeIndex - 1;
    this.items[anteriorPosicion].command();
  }

  async _siguiente() {
    if (this._esPasoFinal()) {
      return;
    }

    this.siguientePorComponente();
  }

  siguientePorComponente() {
    switch (this.activeIndex) {
      case 0:
        this.coberturaComponent._siguiente();
        break;
      case 1:
        this.valorPagarComponent._siguiente();
        break;
    }

    if (this.irSiguiente) {
      this._siguentePosicion();
    }

  }

  _siguentePosicion() {
    const siguientePosicion = this.activeIndex + 1;
    this.items[siguientePosicion].command();
  }

  guardarPorComponente() {
    switch (this.activeIndex) {
      case 0:
        this.coberturaComponent._guardar();
        break;
      case 1:
        this.valorPagarComponent._guardar();
        break;
      case 2:
        this.liquidarComponent._guardar();
        break;
    }
  }

  _siguienteCobertura(event) {
    this.habilitarSiguiente = event;
  }
  _siguienteValorPagar(event) {
    this.habilitarSiguiente = event;
  }

  _irSiguienteCobertura(event) {
    this.irSiguiente = event;
  }

  _irSiguienteValorPagar(event) {
    this.irSiguiente = event;
  }

  _irAtrasValorPagar(event) {
    this.irAtras = event;
    if (this.irAtras) {
      this._atras();
    }
  }

  _guardarCobertura(event) {
    this.habilitarGuardar = event;
  }

  _guardarValorPagar(event) {
    this.habilitarGuardar = event;
  }

  _guardarLiquidar(event) {
    this.habilitarGuardar = event;
  }

  _setValoresAPagar(codigoPlan: number, codigoCobertura) {
    return this.valoresAPagar.find(item => item.codigoPlan === codigoPlan &&
      item.codigoCobertura === codigoCobertura);
  }

  _guardar() {
    this.guardarPorComponente();
  }

  gestionar() {
    this.mostrarBitacora = !this.mostrarBitacora;
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }
}
