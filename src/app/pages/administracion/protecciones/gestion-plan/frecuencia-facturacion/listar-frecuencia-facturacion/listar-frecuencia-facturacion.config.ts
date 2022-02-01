import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarFrecuenciaFacturacionConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.fondo',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.plan',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimFrecuenciaFacturacion.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.frecuencia',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.fechaInicioVigencia',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.vigente',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.gestionPlanes.frecuenciaFacturacion.grid.acciones',
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
