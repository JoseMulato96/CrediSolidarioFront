import { MimGridConfiguracion } from '../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarPromotoresConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'compania',
        titulo: 'administracion.protecciones.promotores.grid.compania',
        keyFiltro: 'nombreCompania',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'numeroIdentificacion',
        titulo: 'administracion.protecciones.promotores.grid.numeroIdentificacion',
        keyFiltro: 'numeroidentificacionPromotor',
        typeFilter: 'textBack',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.promotores.grid.nombrePromotor',
        keyFiltro: 'nombrePromotor',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.promotores.grid.vigente',
        keyFiltro: 'estado',
        typeFilter: 'textBack',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.promotores.grid.fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.promotores.grid.acciones',
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
