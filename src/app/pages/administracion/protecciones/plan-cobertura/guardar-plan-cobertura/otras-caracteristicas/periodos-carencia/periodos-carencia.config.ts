import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class PeriodosCarenciaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'contribuciones',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.contribuciones',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'periodoCarencia',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.periodoCarencia',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'mimUnidadTiempo.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.unidadTiempo',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'mimCausa.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.causa',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.fechaFin',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.vigente',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.periodosCarencia.grid.acciones',
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
}
