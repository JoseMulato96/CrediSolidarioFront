import { MimGridConfiguracion } from '../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarFormulaPlanConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.formulaPlan.grid.plan',
        keyFiltro: 'nombrePlan',
        typeFilter: 'textBack',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimTipoFormulaPlan.nombre',
        titulo: 'administracion.protecciones.formulaPlan.grid.tipoFormulaPlan',
        keyFiltro: 'tipoFormulaPlan',
        typeFilter: 'textBack',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.formulaPlan.grid.estado',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.formulaPlan.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.formulaPlan.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
