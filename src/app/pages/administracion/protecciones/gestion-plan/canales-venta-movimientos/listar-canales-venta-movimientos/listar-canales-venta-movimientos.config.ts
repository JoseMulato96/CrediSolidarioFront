import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCanalesVentaMovimientosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.fondo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.plan',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCanalVenta.codigo',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.codigo',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimCanalVenta.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.nombre',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.fechaInicioVigencia',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.vigente',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.gestionPlanes.canalesVentasMovimientos.grid.acciones',
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
