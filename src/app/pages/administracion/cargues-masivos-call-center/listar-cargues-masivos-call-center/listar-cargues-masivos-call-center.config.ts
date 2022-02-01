import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCargueMasivoCallCenterConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.paginarDatos = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'id',
        titulo: 'administracion.cargueMasivoCallCenter.grid.codigo',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'jobParametrs.parameters.nombreTipoSolicitud.parameter',
        titulo: 'administracion.cargueMasivoCallCenter.grid.tipoMovimiento',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'jobParametrs.parameters.userName.parameter',
        titulo: 'administracion.cargueMasivoCallCenter.grid.usuario',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'jobParametrs.parameters.fileName.parameter',
        titulo: 'administracion.cargueMasivoCallCenter.grid.archivo',
        configCelda: {
          width: 120
        }
      },
      {
        key: 'jobParametrs.parameters.totalElements.parameter',
        titulo: 'administracion.cargueMasivoCallCenter.grid.numeroRegistros',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'executionContext.totalElementsCompleted',
        titulo: 'administracion.cargueMasivoCallCenter.grid.registrosExitosos',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'executionContext.totalElementsFailed',
        titulo: 'administracion.cargueMasivoCallCenter.grid.registrosNovedades',
        configCelda: {
          width: 50
        }
      },
      {
        key: '_fecha',
        titulo: 'administracion.cargueMasivoCallCenter.grid.fechaHora',
        configCelda: {
          width: 70
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
        titulo: 'administracion.cargueMasivoCallCenter.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-download text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 30,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 3
          },
          funDisabled: this.bloquearBoton
        }
      },
      {
        key: 'editarDetalle',
        titulo: 'administracion.cargueMasivoCallCenter.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2',
          width: 30,
          combinarCeldas: {
            omitir: true
          }
          // funDisabled: this.bloquearEditar
        }
      },
      {
        key: 'eliminarDetalle',
        titulo: 'administracion.cargueMasivoCallCenter.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 30,
          combinarCeldas: {
            omitir: true
          }
          // funDisabled: this.bloquearRechazar
        }
      }
    ];
  }
  bloquearBoton(item: any) {
    return item.exitStatus.exitCode !== 'COMPLETED' && item.exitStatus.exitCode !== 'FAILED';
  }
  /* bloquearEditar(item: any) {
    return item.exitStatus.exitCode === 'COMPLETED';
  }
  bloquearRechazar(item: any) {
    return item.exitStatus.exitCode === 'COMPLETED' || item.exitStatus.exitCode === 'FAILED';
  } */
}

