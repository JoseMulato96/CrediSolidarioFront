import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarProyectoVidaConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.nombre',
        key: 'nombre',
        configCelda: {
          width: 180,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.descripcion',
        key: 'descripcion',
        configCelda: {
          width: 290,
          habilitarOrdenamiento: true
        }
      },
      /* {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      }, */
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 40,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }
          // funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 40,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }

  /* bloquearBotonEditar(item: any) {
    return item.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.OBSERVACION;
  } */

}
