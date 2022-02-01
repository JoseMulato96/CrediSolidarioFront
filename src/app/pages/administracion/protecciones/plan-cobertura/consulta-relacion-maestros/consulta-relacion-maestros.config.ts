import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ConsultaRelacionMaestrosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.paginarDatos = true;
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: '_fondo',
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.fondo',
        configCelda: {
          width: 40
        }
      },
      {
        key: '_codigo',
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.codigo',
        configCelda: {
          width: 30
        }
      },
      {
        key: '_nombreMaestro',
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.nombreMaestro',
        configCelda: {
          width: 60
        }
      },
      {
        key: '_descripcion',
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.descripcion',
        configCelda: {
          width: 60
        }
      },
      {
        key: '_planRelacionado',
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.planRelacionado',
        configCelda: {
          width: 60
        }
      },
      {
        titulo: 'administracion.protecciones.consultaRelacionMaestros.grid.estado',
        key: '_estado',
        configCelda: {
          width: 40
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
