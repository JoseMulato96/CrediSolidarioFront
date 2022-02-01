import { MimGridConfiguracion } from '../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ValorRescatePreexistenciaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.codigo',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'mimTipoValorDevolver.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.tipoValorDevolver',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'valor',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.valor',
        configCelda: {
          width: 90,
          tipo: 'numero'
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.antiguedadMinima',
        key: 'antiguedadMinima',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.antiguedadMaxima',
        key: 'antiguedadMaxima',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 110
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorRescatePreexistencia.grid.acciones',
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
