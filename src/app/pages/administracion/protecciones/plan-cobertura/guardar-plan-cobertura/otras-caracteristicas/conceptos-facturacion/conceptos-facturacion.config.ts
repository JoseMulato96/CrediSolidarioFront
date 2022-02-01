import { MimGridConfiguracion } from './../../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ConceptosFacturacionConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.columnas = [
      {
        key: 'mimTipoConcepto.nombre',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.grid.tipoConcepto',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'sipConceptoFacturacion.concepto',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.grid.concepto',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'sipConceptoFacturacion.descripcion',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.grid.descripcion',
        configCelda: {
          width: 200
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.grid.vigente',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'eliminar',
        titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.conceptoFacturacionPlanCobertura.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 60
        }
      },
    ];
  }
}
