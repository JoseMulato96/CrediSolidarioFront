import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class MaestroCuentasConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.cuentaContable',
        key: 'numeroCuenta',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.nombreCuenta',
        key: 'nombreCuenta',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.cuentaColgaap',
        key: 'numeroCOLGAAP',
        configCelda: {
          width: 70
        }
      },
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.cuentaNiff',
        key: 'numeroNIIF',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 60
        }
      },
      {
        titulo: 'administracion.financiera.maestroCuenta.grid.acciones',
        key: 'editar',
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
