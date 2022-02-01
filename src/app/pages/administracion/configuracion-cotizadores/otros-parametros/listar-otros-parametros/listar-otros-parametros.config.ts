import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarOtrosParametrosConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.otrosParametros.grid.descripcion',
        key: 'descripcion',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: false
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.otrosParametros.grid.dias',
        key: 'dias',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: false
        }
      },

      {
        titulo: 'administracion.cofiguracionCotizadores.otrosParametros.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 40
        }
      }
    ];
  }
}
