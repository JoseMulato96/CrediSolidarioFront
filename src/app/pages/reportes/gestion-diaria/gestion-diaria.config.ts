import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class GestionDiariaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'userInfo.identification',
        titulo: 'administracion.reportesGestionDiaria.grid.cedulaColaborador',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'userInfo.name',
        titulo: 'administracion.reportesGestionDiaria.grid.nombreColaborador',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'processInstanceId',
        titulo: 'administracion.reportesGestionDiaria.grid.numeroSolicitud',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'name',
        titulo: 'administracion.reportesGestionDiaria.grid.estado',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'assigneeTime',
        titulo: 'administracion.reportesGestionDiaria.grid.fechaAsignacion',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.reportesGestionDiaria.grid.fechaGestion',
        key: 'commentTime',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.reportesGestionDiaria.grid.asignadoPor',
        key: 'ownerInfo.name',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.reportesGestionDiaria.grid.observacion',
        key: 'observacion',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-message text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 80
        }
      }
      /* {
        titulo: 'administracion.reportesGestionDiaria.grid.observacion',
        key: 'commentMessage',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      } */

    ];
  }
}
