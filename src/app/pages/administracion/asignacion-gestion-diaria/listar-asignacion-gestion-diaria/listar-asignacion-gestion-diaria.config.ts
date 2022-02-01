import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MimWindModalConfiguracion } from './../../../../shared/components/mim-wind-modal/mim-wind-modal.component';

export class ListarAsignacionGestionDiariaConfig {

  gridAsignacionGestionDiaria: MimGridConfiguracion = new MimGridConfiguracion();
  modalResumen: MimWindModalConfiguracion = new MimWindModalConfiguracion();
  gridResumen: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridAsignacionGestionDiaria.paginarDatos = true;
    this.gridAsignacionGestionDiaria.scrollHorizontal = false;
    this.gridAsignacionGestionDiaria.selectMode = true;
    this.gridAsignacionGestionDiaria.seleccionarByKey = 'taskId';
    this.gridAsignacionGestionDiaria.esFiltra = true;
    this.gridAsignacionGestionDiaria.columnas = [
      {
        key: '_processInstanceId',
        titulo: 'administracion.asignacionGestionDiaria.grid.numeroCaso',
        typeFilter: 'text',
        configCelda: {
          tipo: 'link',
          width: 85
        }
      },
      {
        key: 'variables.identificacionAsociado',
        titulo: 'administracion.asignacionGestionDiaria.grid.identificacion',
        typeFilter: 'text',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'variables.nombreAsociado',
        titulo: 'administracion.asignacionGestionDiaria.grid.solicitante',
        typeFilter: 'text',
        configCelda: {
          width: 175
        }
      },
      {
        key: 'variables.nombreEvento',
        titulo: 'administracion.asignacionGestionDiaria.grid.tipoSolicitud',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'variables.tipoSolicitud',
        titulo: 'administracion.asignacionGestionDiaria.grid.solicitud',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'processDaysManagement',
        titulo: 'administracion.asignacionGestionDiaria.grid.dias',
        typeFilter: 'text',
        configCelda: {
          width: 40,
          tipo: 'badge2',
          color: '_color'
        }
      },
      {
        key: 'name',
        titulo: 'administracion.asignacionGestionDiaria.grid.accion',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      },

      {
        key: 'userId',
        titulo: 'administracion.asignacionGestionDiaria.grid.asignadoA',
        typeFilter: 'text',
        configCelda: {
          width: 160
        }
      }
    ];

    this.modalResumen.width = '750px';
    this.modalResumen.titulo = 'administracion.asignacionGestionDiaria.modal.titulo';

    this.gridResumen.paginarDatos = true;
    this.gridResumen.scrollHorizontal = false;
    this.gridResumen.columnas = [
      {
        key: 'processInstanceId',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.numeroCaso',
        configCelda: {
          tipo: 'link',
          width: 100
        }
      },
      {
        key: 'variables.nombreEvento',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.tipoSolicitud',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'userInfo.name',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.usuario',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'daysManagement',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.dias',
        configCelda: {
          width: 100
        }
      }
    ];
  }
}
