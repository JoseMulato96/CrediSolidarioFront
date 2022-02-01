import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCanalesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.canales.grid.codigoCanal',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.canales.grid.nombreCanal',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombreCorto',
        titulo: 'administracion.protecciones.canales.grid.nombreCorto',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.canales.grid.vigente',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.canales.grid.fechaModificacion',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.canales.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }

    ];
  }

}
