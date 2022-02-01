import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';


export class AutomaticoPagosConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  barFilter: MimFiltroVerticalComponentConfig = {};

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.habilitarSeleccionColumnas = true;
    this.gridConfig.columnas = [
      {
        key: 'asociado.nitCli',
        titulo: 'reportes.automaticoPagos.grid.noIdentificacionAsociadoBeneficiarioPago',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'asociado.nombreAsociado',
        titulo: 'reportes.automaticoPagos.grid.nombreAsociadoBeneficiarioPago',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimSolicitudEvento.codigo',
        titulo: 'reportes.automaticoPagos.grid.numeroSolicitud',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimSolicitudEvento.mimEvento.nombre',
        titulo: 'reportes.automaticoPagos.grid.amparo',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimNotificacionEvento.mimEstadoCierre.nombre',
        titulo: 'reportes.automaticoPagos.grid.estadoNotificacion',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.estadoSolicitud',
        key: 'mimSolicitudEvento.mimEstadoSolicitudEvento.nombre',
        configCelda: {
          width: 110,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.formaPago',
        key: 'mimSolicitudEvento.mimFormaPago.nombre',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.numeroCuenta',
        key: 'mimSolicitudEvento.numeroCuentaDeposito',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.valorBase',
        key: 'valorTotalPago',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true,
          tipo: 'currency'
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.valorDeducciones',
        key: 'valorDeduccionesVarias',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true,
          tipo: 'currency'
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.valorRetencion',
        key: 'retefuente',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true,
          tipo: 'currency'
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.valorNeto',
        key: 'valorNetoPago',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true,
          tipo: 'currency'
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.usuarioRadicador',
        key: 'nombreUsuarioRadicador',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'reportes.automaticoPagos.grid.usuarioPagador',
        key: 'nombreUsuarioPagador',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      }

    ];
  }
}
