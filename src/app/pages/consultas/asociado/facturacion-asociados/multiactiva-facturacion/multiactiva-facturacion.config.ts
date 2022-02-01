import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class MultiactivaFacturacionConfig {
  gridMultiactiva: MimGridConfiguracion = new MimGridConfiguracion();
  panelCalculoMultiactiva: any = {};

  constructor() {
    this.gridMultiactiva.selectMode = false;
    this.gridMultiactiva.scrollHorizontal = true;
    this.gridMultiactiva.pagina = 0;
    this.gridMultiactiva.datos = [];
    this.gridMultiactiva.columnas = [
      {
        key: 'codcon',
        titulo: 'asociado.facturacion.multiactiva.concepto',
        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'salant',
        titulo: 'asociado.facturacion.multiactiva.saldo',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'vlrapg',
        titulo: 'asociado.facturacion.multiactiva.vencido',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'cuomes',
        titulo: 'asociado.facturacion.multiactiva.cuota',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'intmor',
        titulo: 'asociado.facturacion.multiactiva.moraCorte',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'totapg',
        titulo: 'asociado.facturacion.multiactiva.pagoTotal',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'ncuven',
        titulo: 'asociado.facturacion.multiactiva.cuotaVencida',

        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'ultpag',
        titulo: 'asociado.facturacion.multiactiva.ultimoPago',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'intapg',
        titulo: 'asociado.facturacion.multiactiva.cuentasCobrar',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'capita',
        titulo: 'asociado.facturacion.multiactiva.moraDia',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'intmes',
        titulo: 'asociado.facturacion.multiactiva.interesesFinaciacion',
        configCelda: { width: 120, cssKey: '', tipo: 'currency2' }
      },
      {
        key: 'sldpos',
        titulo: 'asociado.facturacion.multiactiva.saldoPosterior',
        configCelda: { width: 100, cssKey: '', tipo: 'currency2' }
      }
    ];

    this.panelCalculoMultiactiva.bloques = [
      {
        key: 'totalCapitalVencido',
        titulo: 'asociado.facturacion.multiactiva.vencidoTotal'
      },
      {
        key: 'totalCapitalMes',
        titulo: 'asociado.facturacion.multiactiva.cuotaTotal'
      },
      {
        key: 'totalInteresMoral',
        titulo: 'asociado.facturacion.multiactiva.moraCorteTotal'
      },
      {
        key: 'totalPagar',
        titulo: 'asociado.facturacion.multiactiva.pagoTotal2'
      },
      {
        key: 'totalUltimoPago',
        titulo: 'asociado.facturacion.multiactiva.ultimoTotal'
      }
    ];

    this.panelCalculoMultiactiva.titulo = 'Esta es la sumatoria total';
  }
}
