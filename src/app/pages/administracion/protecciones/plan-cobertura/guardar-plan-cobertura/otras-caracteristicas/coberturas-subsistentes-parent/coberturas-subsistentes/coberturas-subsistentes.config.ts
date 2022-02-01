import { MimGridConfiguracion } from '../../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class CoberturasSubsistentesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  gridDetalleConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [

      {
        key: 'mimCoberturaIndemnizada.codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.codigo',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.plan',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'mimCoberturaIndemnizada.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.coberturaIndemnizada',
        configCelda: {
          width: 80
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.vigente',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.acciones',
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
          width: 30,
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
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.guardar.grid.codigo',
        configCelda: {
          tipo: 'link',
          width: 80
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.grid.vigente',
        configCelda: {
          width: 75
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.guardar.grid.fechaInicio',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasSubsistentes.guardar.grid.fechaFin',
        configCelda: {
          width: 100
        }
      }

    ];

  }

  bloquearBoton(coberturaSubsistente: any) {
    return !coberturaSubsistente.estado;
  }
}
