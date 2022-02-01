import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarExclusionesCoberturaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimExclusion.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.fondo',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCobertura.nombre',
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.cobertura',
        keyFiltro: 'nombreCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimExclusion.descripcion',
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.exclusion',
        keyFiltro: 'descripcionExclusion',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.vigente',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 98,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.gestionCobertura.exclusionCobertura.grid.acciones',
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
