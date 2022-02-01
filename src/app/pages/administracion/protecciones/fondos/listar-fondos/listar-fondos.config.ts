import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarFondosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.fondos.grid.codigoFondo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.fondos.grid.nombreFondo',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCliente.nombre',
        titulo: 'administracion.protecciones.fondos.grid.nombreCliente',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.fondos.grid.vigente',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.fondos.grid.fechaModificacion',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.fondos.grid.acciones',
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
