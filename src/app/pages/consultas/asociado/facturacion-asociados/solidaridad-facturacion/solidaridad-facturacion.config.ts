import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class SolidaridadFacturacionConfig {

  gridSolidaridad: MimGridConfiguracion = new MimGridConfiguracion();

  gridSolidaridadDetalle: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridSolidaridad.selectMode = false;
    this.gridSolidaridad.scrollHorizontal = true;
    this.gridSolidaridad.esFiltra = true;
    this.gridSolidaridad.paginarDatos = true;
    this.gridSolidaridad.pagina = 0;
    this.gridSolidaridad.datos = [];
    this.gridSolidaridad.mostrarPaginador = true;

    this.gridSolidaridad.columnas = [
      {
        key: 'fechaGeneracion',
        titulo: 'asociado.facturacion.solidaridad.fechaCreacion',
        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'periodo',
        titulo: 'asociado.facturacion.solidaridad.periodo',
        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'concepto',
        titulo: 'asociado.facturacion.solidaridad.concepto',
        typeFilter: 'multiselect',
        configCelda: { width: 250, cssKey: '' }
      },
      {
        key: 'prodNombre',
        titulo: 'asociado.facturacion.solidaridad.nombre',
        typeFilter: 'multiselect',
        configCelda: { width: 300, cssKey: '' }
      },
      {
        key: 'valorCuota',
        titulo: 'asociado.facturacion.solidaridad.valorCuota',
        configCelda: { width: 100, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'valorFacturado',
        titulo: 'asociado.facturacion.solidaridad.valorFacturado',
        configCelda: { width: 150, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'nombreEstado',
        titulo: 'asociado.facturacion.solidaridad.estado',
        configCelda: {
          width: 150,
          tipo: 'badge',
          cssKey: 'estado',
          funCss: this.calcularClaseEstado
        }
      },
      {
        key: 'valorGenerado',
        titulo: 'asociado.facturacion.solidaridad.valorGenerado',
        configCelda: { width: 150, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'valorPagado',
        titulo: 'asociado.facturacion.solidaridad.valorPagado',
        configCelda: { width: 150, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'fechaPago',
        titulo: 'asociado.facturacion.solidaridad.fechaPago',
        configCelda: { width: 100, cssKey: '' }
      },
      {
        key: 'valorMora',
        titulo: 'asociado.facturacion.solidaridad.valorMora',
        configCelda: { width: 150, cssKey: '', tipo: 'link-currency' }
      },
      {
        key: 'pagoMora',
        titulo: 'asociado.facturacion.solidaridad.pagoMora',
        configCelda: { width: 100, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'saldoMora',
        titulo: 'asociado.facturacion.solidaridad.saldoMora',
        configCelda: { width: 100, cssKey: '', tipo: 'currency' }
      },
      {
        key: 'saldoValorFacturado',
        titulo: 'asociado.facturacion.solidaridad.saldoValorFacturado',
        configCelda: { width: 150, cssKey: '', tipo: 'currency' }
      }
    ];
  }
  calcularClaseEstado(estado: string) {
    switch (estado) {
      case '1':
        return ['bg--orange1'];
      case '2':
        return ['bg--yellow1'];
      case '3':
        return ['bg--green2'];
      case '5':
        return ['bg--green2'];
      default:
        return ['bg--gray1'];
    }
  }
}
