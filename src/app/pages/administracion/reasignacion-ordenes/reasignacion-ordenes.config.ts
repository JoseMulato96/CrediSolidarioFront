import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimWindModalConfiguracion } from '@shared/components/mim-wind-modal/mim-wind-modal.component';

export class ReasignacionOrdenesConfig {

  gridReasignacion: MimGridConfiguracion = new MimGridConfiguracion();
  modalResumen: MimWindModalConfiguracion = new MimWindModalConfiguracion();
  gridResumen: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridReasignacion.paginarDatos = true;
    this.gridReasignacion.scrollHorizontal = false;
    this.gridReasignacion.selectMode = true;
    this.gridReasignacion.seleccionarByKey = 'taskId';
    this.gridReasignacion.esFiltra = true;
    this.gridReasignacion.columnas = [
      {
        key: '_processInstanceId',
        titulo: 'administracion.reasignacionOrdenes.tarea.solicitud',
        typeFilter: 'text',
        configCelda: {
          tipo: 'link',
          width: 85
        }
      },
      {
        key: 'variables.identificacionAsociado',
        titulo: 'administracion.reasignacionOrdenes.tarea.iDAsociado',
        typeFilter: 'text',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'variables.nombreAsociado',
        titulo: 'administracion.reasignacionOrdenes.tarea.nombreAsociado',
        typeFilter: 'text',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'variables.nombreEvento',
        titulo: 'administracion.reasignacionOrdenes.tarea.producto',
        typeFilter: 'text',
        configCelda: {
          width: 165
        }
      },
      {
        key: 'variables.tipoSolicitud',
        titulo: 'administracion.reasignacionOrdenes.tarea.tipoSolicitud',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'daysManagement',
        titulo: 'administracion.reasignacionOrdenes.tarea.diasProceso',
        typeFilter: 'text',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'name',
        titulo: 'administracion.reasignacionOrdenes.tarea.accion',
        typeFilter: 'text',
        configCelda: {
          width: 150
        }
      }
      /* {
        key: 'userInfo.name',
        titulo: 'administracion.reasignacionOrdenes.tarea.asignadoA',
        typeFilter: 'text',
        configCelda: {
          width: 150
        }
      } */
    ];
  }
}
