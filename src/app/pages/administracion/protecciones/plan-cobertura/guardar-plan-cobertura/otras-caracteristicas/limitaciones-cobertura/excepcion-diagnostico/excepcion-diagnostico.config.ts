import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ExcepcionDiagnosticoConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: '_diagnosticoCobertura',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridDiagnostico.diagnosticoEspecifico',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'maximoDiasPagar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridDiagnostico.diasPagar',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridDiagnostico.fechaExcepcion',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridDiagnostico.vigente',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridDiagnostico.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }
        }
      },
      {
        key: 'eliminar',
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

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
