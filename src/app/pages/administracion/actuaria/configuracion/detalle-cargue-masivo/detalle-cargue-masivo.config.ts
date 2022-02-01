import { MimGridConfiguracion } from './../../../../../../app/shared/components/mim-grid/mim-grid-configuracion'; 

export class DetalleCargueMasivoConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.detalle.grid.edad',
        key: 'codigoCargue',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.detalle.grid.genero',
        key: 'cobertura',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.detalle.grid.factor',
        key: 'tipoFactor',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.detalle.grid.acciones',
        key: 'Ver detalle',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-search text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }


}
