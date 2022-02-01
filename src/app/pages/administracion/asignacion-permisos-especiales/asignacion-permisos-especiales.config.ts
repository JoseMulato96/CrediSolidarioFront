import { MimFiltroVerticalComponentConfig } from './../../../shared/components/mim-filtro-vertical/mim-filtro-vertical.component';
import { MimGridConfiguracion } from './../../../shared/components/mim-grid/mim-grid-configuracion';

export class AsignacionPermisosConfig {


  gridPermisosEspeciales: MimGridConfiguracion = new MimGridConfiguracion();
  barFilter: MimFiltroVerticalComponentConfig = {};

  constructor() {
    this.gridPermisosEspeciales.scrollHorizontal = false;
    this.gridPermisosEspeciales.paginarDatos = false;
    this.gridPermisosEspeciales.mostrarPaginador = false;
    this.gridPermisosEspeciales.columnas = [
      {
        key: 'codigoRol',
        titulo: 'administracion.asignacionPermisos.grid.codigoRol',
        configCelda: {
          width: 300
        }
      },
      {
        key: 'nombreRol',
        titulo: 'administracion.asignacionPermisos.grid.nombreRol',
        configCelda: {
          width: 300
        }
      },
      {
        key: 'permitir',
        titulo: 'administracion.asignacionPermisos.grid.permitir',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-key-2 text--orange1',
          cssButton: 'btn btn--icon bg--orange2',
          width: 200,
        }
      }
    ];
  }
}
