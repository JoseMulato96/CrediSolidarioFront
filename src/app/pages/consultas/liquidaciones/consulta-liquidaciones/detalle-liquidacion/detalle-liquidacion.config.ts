import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { MimDeduccionesCardConfig } from '@shared/components/mim-deducciones-card/mim-deducciones-card.component';
import { MimAccordionSectionConfiguration } from '@shared/components/mim-accordion-section/mim-accordion-section.component';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class DetalleLiquidacionConfig {
  // Configuracion abono a credito.
  mostrarAbonoCredito: boolean;
  configuracionAccordionAbonoCredito: MimAccordionSectionConfiguration = new MimAccordionSectionConfiguration();
  gridAbonoCredito: MimGridConfiguracion = new MimGridConfiguracion();

  // Configuracion de secciones de forma de pago.
  configuracionAccordionFormaPago: MimAccordionSectionConfiguration = new MimAccordionSectionConfiguration();
  configuracionFormPago: any[];
  mostrarFormaPagoDistribucion: boolean;
  gridFormaPagoDistribucion: MimGridConfiguracion = new MimGridConfiguracion();

  // Configuracion de seccion de deducciones.
  gridCoberturas: MimGridConfiguracion = new MimGridConfiguracion();
  totalPago: number;
  deduccionesCard: MimDeduccionesCardConfig = new MimDeduccionesCardConfig();

  // Configuracion de observaciones.
  mostrarObservaciones: boolean;
  observaciones: string[];

  // Configuracion de componente de detalle del asociado, liquidacion, reclamacion, etc.
  datosAsociado: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();
  // Configuracion de componente de detalle del beneficiario del evento reclamado.
  mostrarDatosBeneficiario: boolean;
  datosBeneficiario: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();


  constructor() {
    // Configuracion abono a credito.
    this.configuracionAccordionAbonoCredito._showAccordion = true;
    this.gridAbonoCredito.mostrarPaginador = false;
    this.gridAbonoCredito.columnas = [
      {
        key: '_numeroPagare',
        titulo: 'liquidaciones.detalleLiquidacion.abonoCredito.nPagare'
      },
      {
        key: 'vlrMaxAbonar',
        titulo: 'liquidaciones.detalleLiquidacion.abonoCredito.valorMaxAbonar',
        configCelda: {
          tipo: 'currency'
        }
      },
      {
        key: 'creValor',
        titulo: 'liquidaciones.detalleLiquidacion.abonoCredito.valorAbonado',
        configCelda: {
          tipo: 'currency'
        }
      },
      {
        key: 'saldoPosterior',
        titulo: 'liquidaciones.detalleLiquidacion.abonoCredito.saldo',
        configCelda: {
          tipo: 'currency'
        }
      }
    ];

    // Configuraciones forma de pago.
    this.configuracionAccordionFormaPago._showAccordion = true;
    this.gridFormaPagoDistribucion.mostrarPaginador = true;
    this.gridFormaPagoDistribucion.paginarDatos = true;
    this.gridFormaPagoDistribucion.columnas = [
      {
        key: 'fecApl',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.fechaPago',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'vlrPago',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.valor',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'porcReteFuente',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.porRetefuente',
        configCelda: {
          width: 100,
          tipo: 'percent'
        }
      },
      {
        key: 'vlrReteFuente',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.retefuente',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'vlrDeducciones',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.deducciones',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'vlrNetoPago',
        titulo: 'liquidaciones.detalleLiquidacion.formaPagoDistribuida.detalle.valorNeto',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: '_formaPago',
        titulo: 'Forma de Pago',
        configCelda: {
          width: 100
        }
      }
    ];

    // Configuracion de seccion de deducciones.
    this.gridCoberturas.mostrarPaginador = false;
    this.gridCoberturas.columnas = [
      {
        key: '_nombreCobertura',
        titulo: 'liquidaciones.detalleLiquidacion.grid.nombreCobertura',
        configCelda: {
          width: 460
        }
      },
      {
        key: 'valorBase',
        titulo: 'liquidaciones.detalleLiquidacion.grid.valorBase',
        configCelda: {
          width: 80,
          tipo: 'currency'
        }
      },
      {
        key: '_reconocido',
        titulo: 'liquidaciones.detalleLiquidacion.grid.reconocidos',
        configCelda: {
          width: 80,
          tipo: 'textRight'
        }
      },
      {
        key: 'valorPagado',
        titulo: 'liquidaciones.detalleLiquidacion.grid.valorPago',
        configCelda: {
          width: 80,
          tipo: 'currency'
        }
      }
    ];

    // Configuracion de deducciones de la liquidacion.
    this.deduccionesCard.labelSubtotal = 'liquidaciones.detalleLiquidacion.cardTotalNeto.totalDeducciones';
    this.deduccionesCard.labelTotal = 'liquidaciones.detalleLiquidacion.cardTotalNeto.valorNeto';
    // Configuramos la columna izquierda.
    this.deduccionesCard.leftItems = [
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.cuotaMesual',
        key: 'vlrCuotaMes',
        tipo: 'currency'
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.saldoVencidos',
        key: 'vlrDescuentoCart',
        tipo: 'currency'
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.deduccionesVarias',
        key: 'vlrDescuentoVarios',
        tipo: 'currency'
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.facturacion',
        key: 'vlrFactura',
        tipo: 'currency'
      }

    ];
    // Configuramos la columna derecha.
    this.deduccionesCard.rightItems = [
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.retencion',
        key: 'porcReteFuente',
        tipo: 'percent'
      },
      {
        label: 'liquidaciones.detalleLiquidacion.cardTotalNeto.retefuente',
        key: 'vlrReteFuente',
        tipo: 'currency'
      }
    ];
  }

  aplicarCSS() {
    return ['text-right'];
  }
}
