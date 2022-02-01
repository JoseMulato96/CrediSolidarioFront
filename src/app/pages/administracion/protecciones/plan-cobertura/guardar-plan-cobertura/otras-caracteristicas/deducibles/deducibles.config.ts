import { MimGridConfiguracion } from './../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class DeduciblesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'mimTipoDeducible.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.tipoDeducible',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'mimTipoPago.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.tipoPago',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'cantidad',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.cantidad',
        configCelda: {
          width: 70
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.fechaFin',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.vigente',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.deducibles.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 80
        }
      }
    ];
  }
}
