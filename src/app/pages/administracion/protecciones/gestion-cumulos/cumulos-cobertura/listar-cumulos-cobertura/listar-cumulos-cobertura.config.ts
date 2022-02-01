import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCumulosCoberturaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlanCobertura.mimCobertura.mimFondo.nombre',
        titulo: 'administracion.protecciones.cumuloCobertura.grid.fondo',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_cumulo',
        titulo: 'administracion.protecciones.cumuloCobertura.grid.nombre',
        keyFiltro: 'nombreCumulo',
        typeFilter: 'textBack',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_planesCobertura',
        titulo: 'administracion.protecciones.cumuloCobertura.grid.cobertura',
        configCelda: {
          width: 180,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.nivelesRiesgosCobertura.grid.fechaModificacion',
        configCelda: {
          width: 126,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.cumuloCobertura.grid.vigente',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.cumulo.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 100
        }
      }
    ];
  }
}
