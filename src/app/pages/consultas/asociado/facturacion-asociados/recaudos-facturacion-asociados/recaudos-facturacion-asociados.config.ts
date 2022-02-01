import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class RecaudosFacturacionAsociadosConfig {
  gridRecaudosFacAso: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridRecaudosFacAso.columnas = [
      {
        key: 'consecutivo',
        titulo: 'asociado.facturacion.recaudos.consecutivo',
        configCelda: { tipo: 'link' }
      },
      {
        key: 'concepto',
        titulo: 'asociado.facturacion.recaudos.conceptoFac'
      },
      {
        key: 'prodDescripcion',
        titulo: 'asociado.facturacion.recaudos.nombreProducto'
      },
      {
        key: 'periodo',
        titulo: 'global.period'
      },
      {
        key: 'fechaProceso',
        titulo: 'asociado.facturacion.recaudos.fechaProceso'
      },
      {
        key: 'valorRecaudo',
        titulo: 'asociado.facturacion.recaudos.valorRecaudo',
        configCelda: { tipo: 'currency' }
      },
      {
        key: 'nombre',
        titulo: 'asociado.facturacion.recaudos.exceso'
      },
      {
        key: 'valorExceso',
        titulo: 'asociado.facturacion.recaudos.valorExceso',
        configCelda: { tipo: 'currency' }
      }
    ];
  }
}
