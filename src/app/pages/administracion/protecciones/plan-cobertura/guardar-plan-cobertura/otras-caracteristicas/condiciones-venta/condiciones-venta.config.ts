import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class CondicionesVentaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'numeroContribuciones',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.numeroContribuciones',
        configCelda: {
          width: 45
        }
      },
      {
        key: 'antiguedad',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.antiguedad',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'mimUnidadTiempo.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.tiempoAntiguedad',
        configCelda: {
          width: 45
        }
      },
      {
        key: 'mimTipoSolicitud.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.tipoSolicitud',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 40
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.condicionesVenta.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 20,
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
          width: 100,
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
