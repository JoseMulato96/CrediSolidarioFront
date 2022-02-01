import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCumulosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimFondo.nombre',
        titulo: 'administracion.protecciones.cumulo.grid.fondo',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.cumulo.grid.codigo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.cumulo.grid.nombre',
        keyFiltro: 'nombreCumulo',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimTipoProcesoCumulo.nombre',
        titulo: 'administracion.protecciones.cumulo.grid.procesoCumulo',
        keyFiltro: 'nombreProcesoCumulo',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'dependeOtrosPlanCobertura',
        titulo: 'administracion.protecciones.cumulo.grid.dependeOtrosPlanCobertura',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.cumulo.grid.fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.cumulo.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }

  bloquearBoton(cumulo: any) {
    return !cumulo.estado;
  }
}
