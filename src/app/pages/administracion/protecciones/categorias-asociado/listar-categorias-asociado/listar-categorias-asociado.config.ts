import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCategoriasAsociadoConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimCliente.nombre',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.cliente',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.codigoCategoria',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.nombre',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.estado',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'actualizar',
        titulo: 'administracion.protecciones.categoriasAsociado.grid.acciones',
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
