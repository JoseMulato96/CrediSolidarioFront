import { MimGridConfiguracion } from './../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class CondicionesAsistenciaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  gridDetalleConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'nombreServicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.grid.nombreServicio',
        configCelda: {
          width: 200
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.grid.vigente',
        configCelda: {
          width: 150
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 150
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.grid.acciones',
        key: 'editar',
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

    this.gridDetalleConfig.scrollHorizontal = false;
    this.gridDetalleConfig.paginarDatos = true;
    this.gridDetalleConfig.columnas = [
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.guardar.grid.codigo',
        key: 'codigo',
        configCelda: {
          tipo: 'link',
          width: 100
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.guardar.grid.fechaInicioVigencia',
        key: 'fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condicionesAsistencia.guardar.grid.fechaFinVigencia',
        key: 'fechaFin',
        configCelda: {
          width: 100
        }
      }
    ];
  }

  bloquearBoton(condicionesAsistencia: any) {
    return !condicionesAsistencia.estado;
  }
}
