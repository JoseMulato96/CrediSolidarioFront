import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarMediosFacturacionConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.columnas = [
      {
        key: 'mimPlan.mimFondo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.fondo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.plan',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimMedioFacturacion.codigo',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.codigo',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimMedioFacturacion.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.nombre',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.vigente',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.gestionPlanes.mediosFacturacion.grid.fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.clientes.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }
    ];
  }

  bloquearBoton(medioFacturacion: any) {
    return !medioFacturacion.estado;
  }
}
