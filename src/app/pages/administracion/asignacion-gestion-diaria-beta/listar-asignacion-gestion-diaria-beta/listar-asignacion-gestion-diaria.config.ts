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
          width: 60
        }
      },
      {
        key: 'variables.identificacionAsociado',
        titulo: 'administracion.asignacionGestionDiaria.grid.identificacion',
        typeFilter: 'text',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'variables.nombreAsociado',
        titulo: 'administracion.asignacionGestionDiaria.grid.solicitante',
        typeFilter: 'text',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'variables.tipoSolicitud',
        titulo: 'administracion.asignacionGestionDiaria.grid.tipoSolicitud',
        typeFilter: 'text',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'variables.nombreSolicitud',
        titulo: 'administracion.asignacionGestionDiaria.grid.solicitud',
        typeFilter: 'text',
        configCelda: {
          width: 140
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
      }
    ];

    this.modalResumen.width = '850px';
    this.modalResumen.titulo = 'administracion.asignacionGestionDiaria.modal.titulo';

    this.gridResumen.paginarDatos = true;
    this.gridResumen.scrollHorizontal = false;
    this.gridResumen.columnas = [
      {
        key: 'userInfo.name',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.usuario',
        configCelda: {
          width: 160
        }
      },
      {
        key: 'variables.tipoSolicitud',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.tipoSolicitud',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'variables.nombreSolicitud',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.solicitud',
        configCelda: {
          width: 160
        }
      },
      {
        key: 'name',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.faseSolicitud',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'processInstanceId',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.numeroSolicitud',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'processDaysManagement',
        titulo: 'administracion.asignacionGestionDiaria.modal.grid.dias',
        configCelda: {
          width: 60
        }
      }
    ];
  }
}
