import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarClientesEstadosAsociadosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimCliente.nombre',
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.cliente',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigoEstado',
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.estadoAsociado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.nombreEstadoAsociado',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.vigente',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clienteEstadoAsociado.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 100
        }
      }
    ];
  }

}
