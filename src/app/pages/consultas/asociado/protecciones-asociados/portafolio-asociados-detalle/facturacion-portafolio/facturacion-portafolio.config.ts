import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class FacturacionPortafolioConfig {
  /**
   *
   * @description Grid de las tablas.
   */
  gridFacturacion: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridFacturacion.selectMode = true;
    this.gridFacturacion.scrollHorizontal = true;
    this.gridFacturacion.seleccionarByKey = 'id';
    this.gridFacturacion.paginarDatos = true;

    this.gridFacturacion.columnas = [
      {
        key: 'periodo',
        titulo: 'global.period',
        configCelda: {
          tipo: 'link',
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'tipoNombre',
        titulo: 'asociado.protecciones.facturacion.grid.tipoFacturacion',
        configCelda: { width: 100 }
      },
      {
        key: 'valorCuota',
        titulo: 'asociado.protecciones.facturacion.grid.valorCuota',
        configCelda: { tipo: 'currency', width: 150 }
      },
      {
        key: 'valorGenerado',
        titulo: 'asociado.protecciones.facturacion.grid.valorGenerado',
        configCelda: { tipo: 'currency', width: 150 }
      },
      {
        key: 'valorFacturado',
        titulo: 'asociado.protecciones.facturacion.grid.valorFacturado',
        configCelda: { tipo: 'currency', width: 150 }
      },
      {
        key: 'fechaPago',
        titulo: 'asociado.protecciones.facturacion.grid.fechaPago',
        configCelda: { width: 100 }
      },
      {
        key: 'valorPagado',
        titulo: 'asociado.protecciones.facturacion.grid.valorPagado',
        configCelda: { tipo: 'currency', width: 150 }
      },
      {
        key: 'valorDescapitalizado',
        titulo: 'asociado.protecciones.facturacion.grid.valorDescapitalizado',
        configCelda: { tipo: 'currency', width: 150 }
      },
      {
        key: 'estadoNombre',
        titulo: 'global.status',
        configCelda: {
          tipo: 'badge',
          cssKey: 'estadoNombreCorto',
          funCss: this.calcularClaseEstadoFacturacion,
          width: 150
        }
      }
    ];

    this.gridFacturacion.configFila = {
      funDisable: dato => {
        return dato['estadoNombreCorto'] === 'ANU';
      }
    };
  }

  calcularClaseEstadoFacturacion(estado: string) {
    switch (estado) {
      case 'PEN':
        return ['bg--yellow1'];
      case 'PAR':
        return ['bg--green1'];
      case 'TOT':
        return ['bg--green2'];
      case 'ANU':
        return ['bg--red1'];
      default:
        return ['bg--gray1'];
    }
  }
}
