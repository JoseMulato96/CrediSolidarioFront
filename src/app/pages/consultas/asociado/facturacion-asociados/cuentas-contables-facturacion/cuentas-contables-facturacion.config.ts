import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class CuentasContablesFacturacionConfig {

  gridCuentasContables: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridCuentasContables.selectMode = false;
    this.gridCuentasContables.esFiltra = true;
    this.gridCuentasContables.pagina = 0;
    this.gridCuentasContables.mostrarPaginador = true;
    this.gridCuentasContables.datos = [];
    this.gridCuentasContables.scrollHorizontal = true;

    this.gridCuentasContables.columnas = [
      {
        key: 'cuentaConcepto',
        titulo: 'asociado.facturacion.cuentasContables.cuentaConcepto',
        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'productoDescripcion',
        titulo: 'asociado.facturacion.cuentasContables.productoDescripcion',
        configCelda: { width: 250, cssKey: '' }
      },
      {
        key: 'distribucionesDesc',
        titulo: 'asociado.facturacion.cuentasContables.distribucionesDesc',
        configCelda: { width: 250, cssKey: '' }
      },
      {
        key: 'cuentaNumero',
        titulo: 'asociado.facturacion.cuentasContables.cuentaNumero',
        configCelda: { width: 150, cssKey: '' }
      },
      {
        key: 'pagoValor',
        titulo: 'asociado.facturacion.cuentasContables.pagoValor',
        configCelda: { width: 180, cssKey: '', tipo: 'link-currency' }
      }
    ];
  }
}
