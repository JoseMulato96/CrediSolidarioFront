import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarExclusionesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimFondo.nombre',
        titulo: 'administracion.protecciones.exclusiones.grid.fondo',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.exclusiones.grid.codigo',
        configCelda: {
          width: 50,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'descripcion',
        titulo: 'administracion.protecciones.exclusiones.grid.descripcion',
        keyFiltro: 'descripcionExclusion',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.exclusiones.grid.vigente',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.exclusiones.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.exclusiones.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
