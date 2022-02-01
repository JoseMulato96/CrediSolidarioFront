import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class CuentasContablesFacturacionDetalleConfig {

  gridCuentasContablesDetalle: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridCuentasContablesDetalle.selectMode = false;
    this.gridCuentasContablesDetalle.esFiltra = true;
    this.gridCuentasContablesDetalle.pagina = 0;
    this.gridCuentasContablesDetalle.mostrarPaginador = true;
    this.gridCuentasContablesDetalle.datos = [];

    this.gridCuentasContablesDetalle.columnas = [
      {
        key: 'cuentaPagoCod',
        titulo: 'asociado.facturacion.cuentasContables.detalle.codigo',
        configCelda: { width: 200, cssKey: '' }
      },
      {
        key: 'cuentaPagoFechaPago',
        titulo: 'asociado.facturacion.cuentasContables.detalle.fechaPago',
        configCelda: { width: 200, cssKey: '' }
      },
      {
        key: 'cuentaPagoPeriodo',
        titulo: 'asociado.facturacion.cuentasContables.detalle.periodo',
        configCelda: { width: 200, cssKey: '' }
      },
      {
        key: 'cuentaPagoValor',
        titulo: 'asociado.facturacion.cuentasContables.detalle.valor',
        configCelda: { width: 200, cssKey: '', tipo: 'currency' }
      }
    ];
  }
}
