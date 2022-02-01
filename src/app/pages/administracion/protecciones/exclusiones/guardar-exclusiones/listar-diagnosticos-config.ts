import { MimGridConfiguracion } from "@shared/components/mim-grid/mim-grid-configuracion";

export class ListarDiagnosticosExlusionesConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.paginarDatos = true;
    this.gridConfig.esFiltra = false;
    this.gridConfig.columnas = [
      {
        key: 'nombre',
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.codigo',
        configCelda: {
          width: 130,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.fechaInicio',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.fechaFin',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'disponible',
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.disponible',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.exclusiones.diagnosticos.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 30,
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
          }
        }
      }
    ];
  }
}
