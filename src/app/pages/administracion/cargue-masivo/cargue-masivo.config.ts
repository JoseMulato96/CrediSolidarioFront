import { MimGridConfiguracion } from './../../../shared/components/mim-grid/mim-grid-configuracion';

export class CargueMasivoConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.columnas = [
      {
        key: 'id',
        titulo: 'administracion.cargueMasivo.grid.codigo',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'jobParametrs.parameters.userName.parameter',
        titulo: 'administracion.cargueMasivo.grid.usuario',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'jobParametrs.parameters.fileName.parameter',
        titulo: 'administracion.cargueMasivo.grid.archivo',
        configCelda: {
          width: 120
        }
      },
      {
        key: '_fecha',
        titulo: 'administracion.cargueMasivo.grid.fechaHora',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.cargueMasivo.grid.totalDatos',
        key: 'jobParametrs.parameters.totalElements.parameter',
        configCelda: {
          width: 50
        }
      },
      {
        titulo: 'global.status',
        key: '_exitStatusName',
        configCelda: {
          width: 50
        }
      }, {
        key: 'tooltips',
        configCelda: {
          tipo: 'icon-tooltips',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35
        }
      },
      {
        key: 'descargueDetalle',
        titulo: 'administracion.cargueMasivo.grid.descargarResultados',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-download text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60, funDisabled: this.bloquearBoton
        }
      }
    ];
  }
  bloquearBoton(item: any) {
    return item.exitStatus.exitCode !== 'COMPLETED' && item.exitStatus.exitCode !== 'FAILED';
  }
}

