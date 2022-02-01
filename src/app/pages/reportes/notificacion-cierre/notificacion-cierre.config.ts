import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';

export class NotificacionCierreConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  barFilter: MimFiltroVerticalComponentConfig = {};

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimSolicitudEvento.mimEvento.nombre',
        titulo: 'reportes.notificacionCierre.grid.tipoAuxilioPagado',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimSolicitudEvento.codigo',
        titulo: 'reportes.notificacionCierre.grid.numeroReclamacion',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'asociado.nitCli',
        titulo: 'reportes.notificacionCierre.grid.cedulaAsociadoBeneficiarioPago',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimLiquidacion.fechaPago',
        titulo: 'reportes.notificacionCierre.grid.fechaPago',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaNotificacion',
        titulo: 'reportes.notificacionCierre.grid.fechaNotificacion',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.notificacionCierre.grid.indicadorCerradoContactoExitoso',
        key: '_cerrado',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.notificacionCierre.grid.observacion',
        key: 'observaciones',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      }
    ];
  }
}
