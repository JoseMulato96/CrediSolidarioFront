import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ExclusionesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  gridDetalleConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'mimExclusion.codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.grid.codigo',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'mimExclusion.descripcion',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.grid.exclusion',
        configCelda: {
          width: 200
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.grid.vigente',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.grid.fechaModificacion',
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

    this.gridDetalleConfig.scrollHorizontal = false;
    this.gridDetalleConfig.paginarDatos = true;
    this.gridDetalleConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.guardar.grid.codigo',
        configCelda: {
          tipo: 'link',
          width: 90
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.guardar.grid.vigente',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.guardar.grid.fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.exclusiones.guardar.grid.fechaFin',
        configCelda: {
          width: 90
        }
      }

    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
