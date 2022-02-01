import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarRelacionPlanesConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.esFiltra = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 40,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.planAsociado',
        key: '_planCobertura',
        keyFiltro: 'nombrePlanCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.notaAclaratoria',
        key: 'mimNotaAclaratoria.nombre',
        keyFiltro: 'nombreNotaAclaratoria',
        typeFilter: 'textBack',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.ordenNota',
        key: 'ordenNota',
        keyFiltro: 'nombreOrdenNota',
        typeFilter: 'textBack',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.nivelRiesgo',
        key: '_nivelRiesgo',
        keyFiltro: 'descripcionNivelRiesgo',
        typeFilter: 'textBack',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },

      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.tipoMovimiento',
        key: 'mimNotaAclaratoria.mimTipoMovimiento.nombre',
        keyFiltro: 'nombreTipoMovimiento',
        typeFilter: 'textBack',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.cofiguracionCotizadores.gestionNotas.relacionPlanes.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 20,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 20,
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

}
