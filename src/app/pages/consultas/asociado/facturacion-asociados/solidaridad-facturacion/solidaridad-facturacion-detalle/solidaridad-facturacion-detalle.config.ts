import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class SolidaridadFacturacionDetalleConfig {
  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description Grid de las tablas.
   */
  gridSolidaridadDetalle: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridSolidaridadDetalle.selectMode = false;
    this.gridSolidaridadDetalle.mostrarPaginador = false;
    this.gridSolidaridadDetalle.pagina = 0;
    this.gridSolidaridadDetalle.datos = [];

    this.gridSolidaridadDetalle.columnas = [
      {
        key: 'concepto',
        titulo: 'asociado.facturacion.solidaridad.detalle.concepto'
      },
      { key: 'periodo', titulo: 'asociado.facturacion.solidaridad.detalle.periodo' },
      {
        key: 'valorMora',
        titulo: 'asociado.facturacion.solidaridad.detalle.saldo',
        configCelda: { width: 100, cssKey: '', tipo: 'currency' }
      }
    ];
  }
}
