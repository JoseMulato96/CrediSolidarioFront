import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarPorcentajeCuotasConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.paginarDatos = true;
    this.gridListar.scrollHorizontal = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.nombreCategoria',
        key: 'sipCategoriaAsociado.nombre',
        configCelda: {
          width: 290,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.valorMinimo',
        key: 'porcentajeMinimo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.valorMaximo',
        key: 'porcentajeMaximo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.porcentajeCuota.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      },

    ];
  }
}
