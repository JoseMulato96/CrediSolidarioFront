import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';
export class MaestroUsoLocalConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.financiera.maestroUsoLocal.grid.codigo',
        key: 'codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.maestroUsoLocal.grid.nombreUsoLocal',
        key: 'nombre',
        configCelda: {
          width: 250,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.maestroUsoLocal.grid.vigente',
        key: '_estado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.financiera.maestroUsoLocal.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }

}
