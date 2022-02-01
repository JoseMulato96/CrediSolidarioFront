import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';

export class ListarPlanCoberturaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  gridConfigPlanes: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.selectMode = false;
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.pagina = 0;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.planCobertura.grid.plan',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'mimEstadoPlanCobertura.nombre',
        titulo: 'administracion.protecciones.planCobertura.grid.estado',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCobertura.nombre',
        titulo: 'administracion.protecciones.planCobertura.grid.cobertura',
        // typeFilter: 'multiselect',
        keyFiltro: 'nombreCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 250,
          habilitarOrdenamiento: true,
          codeDropdown: 'cobertura'
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planes.grid.acciones',
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
        titulo: '',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 60,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBotonEliminar
        }
      }

    ];

    this.gridConfigPlanes.paginarDatos = true;
    this.gridConfigPlanes.scrollHorizontal = true;
    this.gridConfigPlanes.esFiltra = true;
    this.gridConfigPlanes.columnas = [
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.planes.grid.nombrePlan',
        typeFilter: 'text',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimTipoPlan.nombre',
        titulo: 'administracion.protecciones.planes.grid.tipoPlan',
        typeFilter: 'text',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimEstadoPlan.nombre',
        titulo: 'administracion.protecciones.planes.grid.estado',
        typeFilter: 'text',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_mimFase',
        titulo: 'administracion.protecciones.planes.grid.fase',
        typeFilter: 'text',
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
        key: 'editar',
        titulo: 'administracion.protecciones.planes.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Editar',
          width: 30,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 5
          }
        }
      },
      {
        key: 'bitacora',
        titulo: '',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-external-link text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Bitacora',
          width: 30,
          combinarCeldas: {
            omitir: true
          }
        }
      },
      {
        key: 'duplicar',
        titulo: '',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-copy-2 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Duplicar',
          width: 30,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBotonDuplicar
        }
      },
      {
        key: 'aprobacion',
        titulo: '',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-check-circle text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Aprobación',
          width: 30,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBotonAprobar
        }
      }
    ];
  }

  bloquearBotonEliminar(item: any) {
    return item.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO
      || item.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.EN_ELIMINACION ||
      (item.mimPlan.mimFaseFlujo !== null && item.mimPlan.mimFaseFlujo !== undefined && (
        item.mimPlan.mimFaseFlujo.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.TECNICA
        || item.mimPlan.mimFaseFlujo.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA
        || item.mimPlan.mimFaseFlujo.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.FINANCIERA));
  }

  bloquearBotonEditar(item: any) {
    return item.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.EN_ELIMINACION ||
      (item.mimPlan.mimFaseFlujo !== null && item.mimPlan.mimFaseFlujo !== undefined && (
        item.mimPlan.mimFaseFlujo.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.ACTUARIA
        || item.mimPlan.mimFaseFlujo.codigo === MIM_PARAMETROS.MIM_FASE_FLUJO.FINANCIERA));
  }

  bloquearBotonDuplicar(item: any) {
    return item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO ||
      item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO ||
      item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.EN_ELIMINACION;
  }

  bloquearBotonAprobar(item: any) {
    return item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO ||
      item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO ||
      item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.EN_ELIMINACION ||
      (item.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO && item.mimFaseFlujo !== undefined);
  }
}
