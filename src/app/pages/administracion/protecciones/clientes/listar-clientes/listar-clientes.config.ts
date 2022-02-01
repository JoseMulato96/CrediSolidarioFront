import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MIM_PARAMETROS } from './../../../../../shared/static/constantes/mim-parametros';

export class ListarClientesConfig {

  gridListarClientes: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarClientes.scrollHorizontal = true;
    this.gridListarClientes.ordenamientoPersonalizado = true;
    this.gridListarClientes.columnas = [
      {
        titulo: 'administracion.protecciones.clientes.grid.tipoIdentificacion',
        key: 'mimTipoIdentificacion.nombreCorto',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.numeroIdentificacion',
        key: 'numeroIdentificacion',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.digitoVerificacion',
        key: 'digitoVerificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.nombre',
        key: 'nombre',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.estadoCliente',
        key: 'mimEstadoCliente.nombre',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          },
          funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 60,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      }
    ];
  }

  bloquearBoton(cliente: any) {
    return cliente.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.INACTIVO ||
    cliente.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.OBSERVACION;
  }

  bloquearBotonEditar(cliente: any) {
    return cliente.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.OBSERVACION;
  }

}
