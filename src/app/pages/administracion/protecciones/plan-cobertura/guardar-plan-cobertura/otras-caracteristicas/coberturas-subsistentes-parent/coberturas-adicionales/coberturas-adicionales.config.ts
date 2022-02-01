import { MimGridConfiguracion } from '../../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class CoberturasAdicionalesConfig {

  gridConfigAdicional: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() { 

    this.gridConfigAdicional.scrollHorizontal = false;
    this.gridConfigAdicional.columnas = [

      {
        key: 'codigo',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasAdicionales.grid.codigo',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'mimCoberturaIndemnizada.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasAdicionales.grid.coberturaIndemnizada',
        configCelda: {
          width: 80
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasAdicionales.grid.vigente',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasAdicionales.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.coberturasAdicionales.grid.acciones',
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

  }

  bloquearBoton(coberturaSubsistente: any) {
    return !coberturaSubsistente.estado;
  }
}
