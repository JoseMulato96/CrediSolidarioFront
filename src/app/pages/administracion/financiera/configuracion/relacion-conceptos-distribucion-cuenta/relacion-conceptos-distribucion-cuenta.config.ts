import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';
export class RelacionConceptosDistribucionCuentConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.paginarDatos = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.codigoConceptoDistribucion',
        key: 'sipDistribuciones.codigo',
        configCelda: {
          width: 75,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.conceptoDistribucion',
        key: 'sipDistribuciones.nombre',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.cuentaContable',
        key: 'mimCuentaUsoLocal.mimCuenta.numeroCuenta',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.nombreCuentaContable',
        key: 'mimCuentaUsoLocal.mimCuenta.nombreCuenta',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.codigoUsoLocal',
        key: 'mimCuentaUsoLocal.mimUsosLocal.codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.nombreUsoLocal',
        key: 'mimCuentaUsoLocal.mimUsosLocal.nombre',
        configCelda: {
          width: 160,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.relacionConceptoDistribucionCuenta.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50
        }
      }
    ];
  }

}
