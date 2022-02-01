import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCategoriasAsociadoHomologacionConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'sipCategoriaAsociado.mimCliente.nombre',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.cliente',
        configCelda: {
          width: 158,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'tipoVincuBuc',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.codigoCategoriaCliente',
        configCelda: {
          width: 158,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.nombreCategoriaCliente',
        configCelda: {
          width: 164,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'sipCategoriaAsociado.codigo',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.CodigoCategoriaAsociado',
        configCelda: {
          width: 158,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'sipCategoriaAsociado.nombre',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.nombreCategoriaAsociado',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.estado',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'actualizar',
        titulo: 'administracion.protecciones.categoriasHomologacion.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 80
        }
      }
    ];
  }

  bloquearBoton(categoriaAsociadoHomologacion: any) {
    return !categoriaAsociadoHomologacion.estado;
  }
}
