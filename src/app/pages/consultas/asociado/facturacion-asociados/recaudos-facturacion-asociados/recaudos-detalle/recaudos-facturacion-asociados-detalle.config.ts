import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class RecaudosFacturacionAsociadosDetalleConfig {
  /**
   *
   * @description Grid de las tablas.
   */
  gridRecaudoDetalleFacAso: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridRecaudoDetalleFacAso.columnas = [
      {
        key: 'productoDescripcion',
        titulo: 'asociado.facturacion.recaudos.plan'
      },
      {
        key: 'distribucionDescripcion',
        titulo: 'asociado.facturacion.recaudos.fondo'
      },
      {
        key: 'cuentaNumero',
        titulo: 'asociado.facturacion.recaudos.numeroCuenta'
      },
      {
        key: 'valor',
        titulo: 'asociado.facturacion.recaudos.valor',
        configCelda: { tipo: 'currency' }
      }
    ];
  }
}
