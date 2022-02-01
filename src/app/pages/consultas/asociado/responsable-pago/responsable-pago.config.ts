import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ResponsablePagoConfig {

  gridListarResponsablePago: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarResponsablePago.selectMode = false;
    this.gridListarResponsablePago.esFiltra = true;
    this.gridListarResponsablePago.pagina = 0;
    this.gridListarResponsablePago.mostrarPaginador = true;
    this.gridListarResponsablePago.datos = [];
    this.gridListarResponsablePago.scrollHorizontal = true;

    this.gridListarResponsablePago.columnas = [
      {
        key: 'mimPersona.numeroId',
        titulo: 'asociado.responsablePago.grid.idResponsablePago',
        configCelda: { width: 180, cssKey: '', tipo: 'link' }
      },
      {
        key: '_nombreCompleto',
        titulo: 'asociado.responsablePago.grid.nombreResponsablePago',
        configCelda: { width: 250, cssKey: '' }
      },
      {
        key: 'mimPersona.mimParentesco.nombre',
        titulo: 'asociado.responsablePago.grid.parentesco',
        configCelda: { width: 150, cssKey: '' }
      },
      {
        key: 'mimPlanCobertura.mimPlan.nombre',
        titulo: 'asociado.responsablePago.grid.plan',
        configCelda: { width: 150, cssKey: '' }
      },
      {
        key: '_estado',
        titulo: 'asociado.responsablePago.grid.estadoResponsablePago',
        configCelda: { width: 250, cssKey: '' }
      },
    ];
  }
}
