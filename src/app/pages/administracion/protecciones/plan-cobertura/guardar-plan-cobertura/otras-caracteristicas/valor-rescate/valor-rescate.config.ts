import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ValorRescateConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.codigo',
        configCelda: {
          width: 60
        }
      },
      {
        key: 'mimCausaIndemnizacion.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.causa',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'contribucionesMinimas',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.contribucionMimina',
        configCelda: {
          width: 120
        }
      },
      {
        key: 'contribucionesMaximas',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.contribucionMaxima',
        configCelda: {
          width: 120
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.vigente',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescate.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60,
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
          width: 60,
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
