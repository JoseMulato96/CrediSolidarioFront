import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ValorCuotaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.codigo',
        configCelda: {
          width: 45
        }
      },
      {
        key: 'mimTipoValorCuota.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.tipoValorCuota',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.fechaInicio',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.fechaFin',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorCuota.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 25,
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
          width: 25,
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
