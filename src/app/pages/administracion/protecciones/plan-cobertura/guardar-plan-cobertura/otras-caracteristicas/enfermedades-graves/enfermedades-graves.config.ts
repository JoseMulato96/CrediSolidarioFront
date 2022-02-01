import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class EnfermedadesGravesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'mimEnfermedadGrave.codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.grid.codigo',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'mimEnfermedadGrave.descripcion',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.grid.nombre',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 40
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 60
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.enfermedadesGraves.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 12,
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
