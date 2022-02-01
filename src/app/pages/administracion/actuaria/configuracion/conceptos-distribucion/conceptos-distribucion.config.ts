import { MimGridConfiguracion } from './../../../../../../app/shared/components/mim-grid/mim-grid-configuracion';

export class ConceptosDistribucionConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.actuaria.conceptosDistribucion.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.conceptosDistribucion.grid.descripcion',
        key: 'nombre',
        configCelda: {
          width: 270,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.conceptosDistribucion.grid.nombreCorto',
        key: 'nombreCorto',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.conceptosDistribucion.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.conceptosDistribucion.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }


}
