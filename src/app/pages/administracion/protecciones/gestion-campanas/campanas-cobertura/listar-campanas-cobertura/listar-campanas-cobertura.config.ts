import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCampanasPlanCoberturaConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.campanasCobertura.grid.campanaEndoso',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombrePlan',
        titulo: 'administracion.protecciones.campanasCobertura.grid.planCobertura',
        keyFiltro: 'nombrePlanCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'valorFijo',
        titulo: 'administracion.protecciones.campanasCobertura.grid.valorFijo',
        keyFiltro: 'valorDestinado',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.campanasCobertura.grid.fechaModificacion',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'estado',
        titulo: 'administracion.protecciones.campanasCobertura.grid.disponible',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.campanasCobertura.grid.acciones',
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
        }
      }

    ];
  }
}