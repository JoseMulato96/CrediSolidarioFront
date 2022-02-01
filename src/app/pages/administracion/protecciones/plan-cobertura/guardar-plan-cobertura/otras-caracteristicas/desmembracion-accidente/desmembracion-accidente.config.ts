import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class DesmembracionAccidenteConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.codigo',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'mimDesmembracionPorAccidente.descripcion',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.desmembracionAccidente',
        configCelda: {
          width: 110
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.porcentajeParaPagar',
        key: '_pagoPorDesmembracionAccidental',
        configCelda: {
          width: 55
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.tipoValor',
        key: 'mimTipoValorProteccion.nombre',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.cobertura',
        key: 'mimCobertura.nombre',
        configCelda: {
          width: 60
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.disponible',
        key: '_estado',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.desmembracionAccidente.grid.acciones',
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
          width: 20,
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
