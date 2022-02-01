import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ProcesosAutomaticosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.columnas = [
      {
        key: 'id',
        titulo: 'reportes.procesosAutomaticos.grid.codigoProceso',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'jobParametrs.parameters.userName.parameter',
        titulo: 'reportes.procesosAutomaticos.grid.usuario',
        configCelda: {
          width: 130
        }
      },
      {
        key: '_fecha',
        titulo: 'reportes.procesosAutomaticos.grid.fechaHoraEjecucion',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'reportes.procesosAutomaticos.grid.cantidadRegistros',
        key: 'totalRegistros',
        configCelda: {
          width: 50
        }
      },
      {
        titulo: 'reportes.procesosAutomaticos.grid.estado',
        key: '_exitStatusName',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'tooltips',
        configCelda: {
          tipo: 'icon-tooltips',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35
        }
      },
      {
        key: 'descargueDetalle',
        titulo: 'reportes.procesosAutomaticos.grid.logErrores',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-download text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60,
          funDisabled: this.bloquearBoton
        }
      }
    ];
  }
  bloquearBoton(item: any) {
    return item.exitStatus.exitCode !== 'COMPLETED' && item.exitStatus.exitCode !== 'FAILED';
  }
}

