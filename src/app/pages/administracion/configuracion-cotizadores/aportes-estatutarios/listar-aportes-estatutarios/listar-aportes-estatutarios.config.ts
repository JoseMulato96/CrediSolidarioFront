import { MimGridConfiguracion } from '../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarAportesEstatutariosConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.tipoVinculacion',
        key: 'mimTipoVinculacion.nombre',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.tipoAporte',
        key: 'mimTipoAporte.nombre',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.valorSugerido',
        key: 'valorSugerido',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.valorMinimo',
        key: 'valorMinimo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.aportesEstatutarios.grid.valorMaximo',
        key: 'valorMaximo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.proyectoVida.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 70,
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
          width: 50
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
