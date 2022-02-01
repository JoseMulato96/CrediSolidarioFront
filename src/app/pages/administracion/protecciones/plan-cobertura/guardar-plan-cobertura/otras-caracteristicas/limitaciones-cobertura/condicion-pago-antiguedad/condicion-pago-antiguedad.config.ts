import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class CondicionPagoAntiguedadConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'antiguedadMinima',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.antiguedadMinima',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'antiguedadMaxima',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.antiguedadMaxima',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'mimTipoLimitacion.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.condicionPagar',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'valor',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.cantidad',
        configCelda: {
          width: 70,
          tipo: 'numero'
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.fechaCondicion',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.vigente',
        configCelda: {
          width: 75
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.gridAntiguedad.acciones',
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

  bloquearBoton(item: any) {
    return !item.estado;
  }

}
