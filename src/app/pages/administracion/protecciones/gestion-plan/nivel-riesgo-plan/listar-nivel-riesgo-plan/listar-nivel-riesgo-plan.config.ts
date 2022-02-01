import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarNivelRiesgoPlanConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.selectMode = false;
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.pagina = 0;
    this.gridConfig.datos = [];
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.fondo',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.plan',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimNivelRiesgo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.nivelRiesgo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.fechaInicio',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.vigente',
        configCelda: {
          width: 100,
          sortKey: 'estado',
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.gestionPlanes.nivelesRiesgo.grid.fechaModificacion',
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
          width: 70
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
