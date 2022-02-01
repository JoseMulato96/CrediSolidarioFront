import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { MimGridConfiguracion } from './../../../../../../app/shared/components/mim-grid/mim-grid-configuracion';

export class CargueMasivoFactoresConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.codigo',
        key: 'mimCargue.codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'Usuario',
        key: '_nombreUsuario',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.tipoFactor',
        key: 'mimTipoFactor.nombre',
        configCelda: {
          width: 110,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.cobertura',
        key: 'mimPlanCobertura.nombre',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.descripcion',
        key: 'mimCargue.descripcion',
        configCelda: {
          width: 160,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.archivo',
        key: 'mimCargue.nombreArchivo',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.fechaInicioFinCargue',
        key: 'mimCargue.fechaCreacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.totalDatos',
        key: 'mimCargue.totalDatos',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.acciones',
        key: 'Ver detalle',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-search text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 3
          },
          width: 40
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.acciones',
        key: 'Aplicar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-check text--green1',
          cssButton: 'btn btn--icon bg--green3 mx-auto',
          width: 40,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearAplicar
        }
      },
      {
        titulo: 'administracion.actuaria.cargueMasivoFactores.grid.acciones',
        key: 'Eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 40,
          combinarCeldas: {
            omitir: true
          }
        }
      }
    ];
  }

  bloquearAplicar(row: any) {
    return !(row.mimEstadosPeriodo.codigo === MIM_PARAMETROS.MIM_ESTADO_PERIODO.PROCESO);
  }
}
