import { MimGridConfiguracion } from './../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class CondicionesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.columnas = [
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.grid.fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.grid.fechaFin',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.grid.vigente',
        configCelda: {
          width: 60
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.grid.fechaModificacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }

}
