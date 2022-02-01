import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class AmparosPagadosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'cedulaAsociado',
        titulo: 'administracion.reportesAmparosPagados.grid.identificacionAsociado',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombreAsociado',
        titulo: 'administracion.reportesAmparosPagados.grid.nombreAsociado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'consecutivoReclamacion',
        titulo: 'administracion.reportesAmparosPagados.grid.numeroSolicitud',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'producto',
        titulo: 'administracion.reportesAmparosPagados.grid.producto',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      }
    ];
  }
}
