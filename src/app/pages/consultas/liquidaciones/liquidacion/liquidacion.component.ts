import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { MimDeduccionesCardConfig } from '@shared/components/mim-deducciones-card/mim-deducciones-card.component';
import { MimFormaPagoComponentConfiguracion } from '@shared/components/mim-forma-pago/mim-forma-pago.component';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { ReportConfiguration, ReportParams } from '@shared/models/report-params.model';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { ObjectUtil } from '@shared/util/object.util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html'
})
export class LiquidacionComponent implements OnInit, OnDestroy, AfterViewInit {

  subs: Subscription[] = [];
  codigoLiquidacion: string;
  mimLiquidacion: any;
  datosAsociado: any;
  datosSolicitudEventoMimPersonaDetalle: MimPersonaDetalleConfiguracion;
  datosMimFormaPagoComponentConfiguracion: MimFormaPagoComponentConfiguracion;
  datosCoberturasMimGridConfiguracion: MimGridConfiguracion;
  datosDeduccionesMimDeduccionesCardConfig: MimDeduccionesCardConfig;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly location: Location,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
  }

  ngOnInit() {
    this.subs.push(this.activatedRoute.params.subscribe(params => {
      this.codigoLiquidacion = params.codigoLiquidacion;

      // Obtenemos mimLiquidacion.
      this.obtenerMimLiquidacion(this.codigoLiquidacion);
    }));
  }

  ngOnDestroy() {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  ngAfterViewInit() {
    // do nothing
  }

  private obtenerMimLiquidacion(codigoMimLiquidacion: any) {
    this.backService.liquidacion.getLiquidacionEvento(codigoMimLiquidacion).subscribe((mimLiquidacion: any) => {
      this.mimLiquidacion = mimLiquidacion;

      // Contruimos objetos requeridos al tener los datos necesarios.
      this.construirDatosMimFormaPagoComponentConfiguracion();

      // Construimos la tabla de coberturas.
      this.construirDatosCoberturasMimGridConfiguracion();

      // Constuimos el encabezado de la liquidacion (Deducciones)
      this.construirDatosDeduccionesMimDeduccionesCardConfig();

      // Obtenemos los datos del asociado.
      this.obtenerAsociado(this.mimLiquidacion.mimSolicitudEvento.asoNumInt);
    }, (error) => {
      this.frontService.alert.warning(error.error.message);
    });
  }

  private obtenerAsociado(asoNumInt: any) {
    this.backService.asociado.obtenerAsociado(asoNumInt).subscribe((datosAsociado: any) => {
      this.datosAsociado = datosAsociado;

      // Construimos datosSolicitudEventoMimPersonaDetalle.
      this.construirDatosSolicitudEventoMimPersonaDetalle();
    }, (error) => {
      this.frontService.alert.error(error.error.message);
    });
  }

  private construirDatosSolicitudEventoMimPersonaDetalle() {
    this.datosSolicitudEventoMimPersonaDetalle = new MimPersonaDetalleConfiguracion();
    // Indicamos que estara abierto por defecto.
    this.datosSolicitudEventoMimPersonaDetalle.collapsable = true;
    this.datosSolicitudEventoMimPersonaDetalle.title = this.datosAsociado.nomCli;
    this.datosSolicitudEventoMimPersonaDetalle.items = [
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.nombre',
        key: 'nomCli',
        value: this.datosAsociado.nomCli
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.identificacion',
        key: 'nitCli',
        value: this.datosAsociado.nitCli
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.tipoAuxilio',
        value: this.mimLiquidacion.mimSolicitudEvento.mimEvento.nombre
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.noReclamacion',
        value: this.mimLiquidacion.mimSolicitudEvento.codigo
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.noLiquidacion',
        value: this.mimLiquidacion.codigo
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.fechaEevento',
        value: this.mimLiquidacion.mimSolicitudEvento.fechaEvento
      },
      {
        label: 'liquidaciones.detalleLiquidacion.datosAsociado.fechaReclamacion',
        value: this.mimLiquidacion.mimSolicitudEvento.fechaSolicitud
      }
    ];
  }

  private construirDatosMimFormaPagoComponentConfiguracion() {
    const mimSolicitudEvento = this.mimLiquidacion.mimSolicitudEvento;
    this.datosMimFormaPagoComponentConfiguracion = new MimFormaPagoComponentConfiguracion();
    this.datosMimFormaPagoComponentConfiguracion.mimFormaPago = mimSolicitudEvento.mimFormaPago;

    switch (mimSolicitudEvento.mimFormaPago.codigo) {
      case MIM_PARAMETROS.MIM_FORMA_PAGO.CHEQUE:
        this.datosMimFormaPagoComponentConfiguracion.informacionFormaPago = [
          {
            titulo: 'liquidaciones.detalleLiquidacion.formaPagoGiro.detalle.agenciaCobro',
            valor: null !== mimSolicitudEvento.oficinaGiroInfo && undefined !== mimSolicitudEvento.oficinaGiroInfo ?
              mimSolicitudEvento.oficinaGiroInfo.nomAgc : ''
          }
        ];
        break;
      case MIM_PARAMETROS.MIM_FORMA_PAGO.DEPOSITOS:
        this.datosMimFormaPagoComponentConfiguracion.informacionFormaPago = [
          {
            titulo: 'liquidaciones.detalleLiquidacion.formaPagoDeposito.detalle.noCuenta',
            valor: mimSolicitudEvento.numeroCuentaDeposito
          },
          {
            titulo: 'liquidaciones.detalleLiquidacion.formaPagoDeposito.detalle.banco',
            valor: mimSolicitudEvento.mimBanco.nombre
          }
        ];
        break;
      case MIM_PARAMETROS.MIM_FORMA_PAGO.DISTRIBUCION:
        break;
    }
  }

  private construirDatosCoberturasMimGridConfiguracion() {
    this.datosCoberturasMimGridConfiguracion = new MimGridConfiguracion();
    this.datosCoberturasMimGridConfiguracion.mostrarPaginador = false;
    this.datosCoberturasMimGridConfiguracion.columnas = [{
      key: 'nombrePlanCobertura',
      titulo: 'liquidaciones.detalleLiquidacion.grid.nombreCobertura',
      configCelda: {
        width: 250
      }
    },
    {
      key: 'valorProteccion',
      titulo: 'liquidaciones.detalleLiquidacion.grid.valorBase',
      configCelda: {
        width: 150,
        tipo: 'currency'
      }
    },
    {
      key: 'reconocidos',
      titulo: 'liquidaciones.detalleLiquidacion.grid.reconocidos',
      configCelda: {
        width: 150
      }
    },
    {
      key: 'valorProteccionBase',
      titulo: 'liquidaciones.detalleLiquidacion.grid.valorPago',
      configCelda: {
        width: 150,
        tipo: 'currency'
      }
    }];

    this.mimLiquidacion.mimLiquidacionDetalleList.forEach(mimLiquidacionDetalle => {
      const numeroReconocidos = null !== mimLiquidacionDetalle.numeroReconocidos
        && undefined !== mimLiquidacionDetalle.numeroReconocidos && mimLiquidacionDetalle.numeroReconocidos > 1 ?
        mimLiquidacionDetalle.numeroReconocidos : '';
      const nombreReconocidos = null !== mimLiquidacionDetalle.mimTipoReconocido && undefined !== mimLiquidacionDetalle.mimTipoReconocido
        && null !== mimLiquidacionDetalle.mimTipoReconocido.nombre && undefined !== mimLiquidacionDetalle.mimTipoReconocido.nombre ?
        mimLiquidacionDetalle.mimTipoReconocido.nombre : '';
      mimLiquidacionDetalle.reconocidos = `${numeroReconocidos} ${nombreReconocidos}`;
    });
    this.datosCoberturasMimGridConfiguracion.datos = this.mimLiquidacion.mimLiquidacionDetalleList;
  }

  private construirDatosDeduccionesMimDeduccionesCardConfig() {
    this.datosDeduccionesMimDeduccionesCardConfig = new MimDeduccionesCardConfig();
    this.datosDeduccionesMimDeduccionesCardConfig.labelSubtotal = 'liquidaciones.detalleLiquidacion.cardTotalNeto.totalDeducciones';
    this.datosDeduccionesMimDeduccionesCardConfig.labelTotal = 'liquidaciones.detalleLiquidacion.cardTotalNeto.valorNeto';
    this.datosDeduccionesMimDeduccionesCardConfig.subtotal = this.mimLiquidacion.valorTotalDeducciones;
    this.datosDeduccionesMimDeduccionesCardConfig.total = this.mimLiquidacion.valorNetoPago;
    // Configuramos la columna izquierda.
    this.datosDeduccionesMimDeduccionesCardConfig.leftItems = [
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.cuotaMesual',
        key: 'vlrCuotaMes',
        tipo: 'currency',
        value: this.mimLiquidacion.valorCuotaMes
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.saldoVencidos',
        key: 'vlrDescuentoCart',
        tipo: 'currency',
        value: this.mimLiquidacion.valorDescuentoSaldos
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.deduccionesVarias',
        key: 'vlrDescuentoVarios',
        tipo: 'currency',
        value: this.mimLiquidacion.valorDeduccionesVarias
      }
    ];
    // Configuramos la columna derecha.
    this.datosDeduccionesMimDeduccionesCardConfig.rightItems = [
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.retencion',
        key: 'porcReteFuente',
        tipo: 'percent',
        value: this.mimLiquidacion.retefuente
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.retefuente',
        key: 'vlrReteFuente',
        tipo: 'currency',
        value: this.mimLiquidacion.porcentajeRetefuente
      }
    ];
  }

  public irAtras() {
    this.location.back();
  }

  public exportarPDF() {
    const parametros: any = {};
    // Configuramos el titulo del reporte.
    parametros.tituloReporte = 'liquidaciones.detalleLiquidacion.titulo';

    // Datos del asociado, reclamacion y liquidaci;ón.
    parametros.nombreAsociado = this.datosAsociado.nomCli;
    parametros.identificacionAsociado = this.datosAsociado.nitCli;
    parametros.detalleAsociado = [];
    this.datosSolicitudEventoMimPersonaDetalle.items.forEach(datoAsociado => {
      // A partir de 28/09/2019 a solicitud del PO no se informa nombre del asociado e identificacion en la seccion
      // de datos del asociado del reporte.
      if (datoAsociado.key !== 'nomCli' && datoAsociado.key !== 'nitCli') {
        parametros.detalleAsociado.push({ titulo: datoAsociado.label, valor: datoAsociado.value });
      }
    });

    // Indicamos que no debe mostrar informacion de familiar directo.
    parametros.mostrarFamiliarFallecido = false;

    // Indicamos que no debe mostrar informacion de abono a credito.
    parametros.mostrarAbonoACredito = false;

    // Configuramos la forma de pago.
    const mimFormaPago = this.mimLiquidacion.mimSolicitudEvento.mimFormaPago;
    parametros.tituloFormaPago = 'liquidaciones.detalleLiquidacion.formaPago';
    parametros.formaPago = String(mimFormaPago.codigo);
    parametros.nombreFormaPago = mimFormaPago.nombre;
    parametros.detalleFormaPago = this.datosMimFormaPagoComponentConfiguracion.informacionFormaPago;

    // Configuramos las coberturas.
    parametros.detalleCoberturas = this.construirDetalleCoberturas();
    parametros.valorTotalPago = this.mimLiquidacion.valorTotalPago;

    // Indicamos que no debe mostrar los componentes asociados a forma de pago distribucion o rentas.
    parametros.mostrarFormaPagoDistribucion = false;

    // Configuramos el detalle de deducciones.
    parametros.tituloCuotaMensual = 'liquidaciones.detalleLiquidacion.cardTotalNeto.cuotaMesual';
    parametros.cuotaMensual = this.mimLiquidacion.valorCuotaMes;
    parametros.tituloSaldosVencidos = 'liquidaciones.detalleLiquidacion.cardTotalNeto.saldoVencidos';
    parametros.saldosVencidos = this.mimLiquidacion.valorDescuentoSaldos;
    parametros.tituloDeduccionesVarias = 'liquidaciones.detalleLiquidacion.cardTotalNeto.deduccionesVarias';
    parametros.deduccionesVarias = this.mimLiquidacion.valorDeduccionesVarias;
    parametros.tituloTotalDeducciones = 'liquidaciones.detalleLiquidacion.cardTotalNeto.totalDeducciones';
    parametros.totalDeducciones = this.mimLiquidacion.totalDeducciones;
    parametros.mostrarRendimiento = false;
    parametros.tituloPorcRetefuente = 'liquidaciones.detalleLiquidacion.cardTotalNeto.retencion';
    parametros.porcRetefuente = this.mimLiquidacion.porcentajeRetefuente;
    parametros.tituloRetefuente = 'liquidaciones.detalleLiquidacion.cardTotalNeto.retefuente';
    parametros.retefuente = this.mimLiquidacion.retefuente;
    parametros.tituloValorNetoPago = 'liquidaciones.detalleLiquidacion.cardTotalNeto.valorNeto';
    parametros.valorNetoPago = this.mimLiquidacion.valorNetoPago;

    // Seteamos las obsrvaciones.
    parametros.tituloObservaciones = 'global.observations';
    parametros.mostrarObservaciones = true;
    // Por ahora solo hay una observacion, creamos aqui el arreglo.
    parametros.observaciones = [this.mimLiquidacion.observaciones];

    // Traducimos el objeto.
    ObjectUtil.traducirObjeto(parametros, this.translate);

    // Configuramos la peticion.
    const peticion = new ReportParams();
    peticion.nombre = `${this.mimLiquidacion.mimSolicitudEvento.codigo}_${DateUtil.dateToString(new Date(), GENERALES.FECHA_WITHOUT_SEPARATOR_PATTERN)}_${DateUtil.dateToString(new Date(), GENERALES.HORA_WITHOUT_SEPARATOR_PATTERN)}`;
    peticion.parameters = parametros;
    peticion.configuration = {
      isEncrypted: true,
      is128BitKey: true,
      userPassword: this.datosAsociado.nitCli
    } as ReportConfiguration;

    this.backService.utilidades.generarJasper('pdf', 'detalle-liquidaciones', peticion).subscribe(respuesta => {
      const body: any = respuesta.body;
      FileUtils.downloadPdfFile(body, peticion.nombre);
    }, async (err) => {
      const message = JSON.parse(await err.error.text()).message;
      this.frontService.alert.error(message);
    });

  }

  private construirDetalleCoberturas() {
    const detalleCoberturas = [];
    this.mimLiquidacion.mimLiquidacionDetalleList.forEach((mimLiquidacionDetalle: any) => {
      const numeroReconocidos = null !== mimLiquidacionDetalle.numeroReconocidos
        && undefined !== mimLiquidacionDetalle.numeroReconocidos && mimLiquidacionDetalle.numeroReconocidos > 1 ?
        mimLiquidacionDetalle.numeroReconocidos : ' ';
      const nombreReconocidos = null !== mimLiquidacionDetalle.mimTipoReconocido && undefined !== mimLiquidacionDetalle.mimTipoReconocido
        && null !== mimLiquidacionDetalle.mimTipoReconocido.nombre && undefined !== mimLiquidacionDetalle.mimTipoReconocido.nombre ?
        mimLiquidacionDetalle.mimTipoReconocido.nombre : ' ';

      detalleCoberturas.push({
        recCodigo: mimLiquidacionDetalle.codigoSolicitudEvento,
        auxCodigo: mimLiquidacionDetalle.codigoCobertura,
        auxNombre: mimLiquidacionDetalle.mimCobertura.nombre,
        tipAuxCodigo: this.mimLiquidacion.mimSolicitudEvento.mimEvento.codigo,
        tipAuxDescripcion: this.mimLiquidacion.mimSolicitudEvento.mimEvento.nombre,
        prodCodigo: mimLiquidacionDetalle.codigoPlan,
        prodDescripcion: mimLiquidacionDetalle.mimPlan.nombre,
        valorBase: mimLiquidacionDetalle.valorProteccion,
        valorPagado: mimLiquidacionDetalle.valorProteccionBase,
        reconocido: numeroReconocidos,
        tipoReconocimiento: mimLiquidacionDetalle.mimTipoReconocido.codigo,
        tipoReconocimientoNombre: nombreReconocidos,
        tipoReconocimientoNombreCorto: nombreReconocidos
      });
    });

    return detalleCoberturas;
  }
}
