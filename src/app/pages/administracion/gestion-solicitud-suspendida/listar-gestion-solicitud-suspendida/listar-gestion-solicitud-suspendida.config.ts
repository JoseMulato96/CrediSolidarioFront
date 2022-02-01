import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarGestionSolicitudSuspendidaConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.paginarDatos = true;
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: '_processInstanceId',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.numeroCaso',
        typeFilter: 'text',
        configCelda: {
          tipo: 'link',
          width: 60
        }
      },
      {
        key: 'variables.identificacionAsociado',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.identificacion',
        typeFilter: 'text',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'variables.nombreAsociado',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.solicitante',
        typeFilter: 'text',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'variables.tipoSolicitud',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.tipoSolicitud',
        typeFilter: 'text',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'variables.nombreSolicitud',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.solicitud',
        typeFilter: 'text',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'processDaysManagement',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.dias',
        typeFilter: 'text',
        configCelda: {
          width: 40,
          tipo: 'badge2',
          color: '_color'
        }
      },
      {
        key: 'name',
        titulo: 'administracion.gestionSolicitudSuspendida.grid.accion',
        typeFilter: 'text',
        configCelda: {
          width: 100
        }
      }
    ];
  }
}
