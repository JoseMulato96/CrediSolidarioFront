import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MIM_PARAMETROS } from './../../../../../../shared/static/constantes/mim-parametros';

export class ListarProductosExcluyentesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimTipoMovimiento.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.tipoSolicitud',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan1.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.fondo1',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan1.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.nombrePlan1',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan2.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.fondo2',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan2.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.nombrePlan2',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.disponible',
        configCelda: {
          width: 110,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.gestionPlanes.productosEscluyentes.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 40,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }
        }
      },
      {
        key: 'eliminar',
        titulo: '',
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

  bloquearBoton(row: any) {
    return row.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO;
  }
}
