import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MIM_PARAMETROS } from './../../../../../../shared/static/constantes/mim-parametros';

export class ListarPlanesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimFondo.nombre',
        titulo: 'administracion.protecciones.planes.grid.fondo',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 180,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planes.grid.codigo',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.planes.grid.nombre',
        keyFiltro: 'nombrePlan',
        typeFilter: 'textBack',
        configCelda: {
          width: 190,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimTipoPlan.nombre',
        titulo: 'administracion.protecciones.planes.grid.tipoPlan',
        keyFiltro: 'nombreTipoPlan',
        typeFilter: 'textBack',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimEstadoPlan.nombre',
        titulo: 'administracion.protecciones.planes.grid.estado',
        keyFiltro: 'nombreEstadoPlan',
        typeFilter: 'textBack',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planes.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          },
          funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'eliminar',
        titulo: '',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 50,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      }

    ];
  }

  bloquearBoton(plan: any) {
    return plan.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO ||
      plan.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.EN_ELIMINACION;
  }

  bloquearBotonEditar(plan: any) {
    return plan.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.EN_ELIMINACION;
  }
}
