import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class PlanCoberturaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  gridConfigCobertura: MimGridConfiguracion = new MimGridConfiguracion();
  gridConfigDetalle: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.paginarDatos = true;
    this.gridConfig.columnas = [
      {
        key: 'plan.tipoPlan',
        titulo: 'asociado.protecciones.portafolio.planes.grid.tipoPlan',
        configCelda: {
          tipo: 'badge2',
          color: 'codigoColor',
          width: 120
        }
      },
      {
        key: 'plan.nombre',
        titulo: 'asociado.protecciones.portafolio.planes.grid.plan',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'tooltips',
        configCelda: {
          tipo: 'icon-tooltips',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35
        }
      },
      {
        key: 'plan.totalProteccion',
        titulo: 'asociado.protecciones.portafolio.planes.grid.proteccion',
        configCelda: {
          tipo: 'currency',
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'plan.totalCuota',
        titulo: 'asociado.protecciones.portafolio.planes.grid.cuota',
        configCelda: {
          tipo: 'currency',
          width: 55,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.planes.grid.fechaRegistro',
        key: 'plan.fechaAprobacion',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'asociado.protecciones.portafolio.planes.grid.detalle',
        titulo: 'Detalle',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-external-link text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50
        }
      }
    ];

    /* Cobertura */
    this.gridConfigCobertura.paginarDatos = true;
    this.gridConfigCobertura.columnas = [
      {
        key: 'plan.nombre',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.plan',
        configCelda: {
          tipo: 'badge2',
          color: '_color',
          width: 100
        }
      },
      {
        key: 'planCobertura.nombre',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.cobertura',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'valorProteccion',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.proteccion',
        configCelda: {
          tipo: 'link-currency',
          width: 70
        }
      },
      {
        key: 'cuota',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.cuota',
        configCelda: {
          tipo: 'currency',
          width: 55
        }
      },
      {
        key: 'factor',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.factor',
        configCelda: {
          width: 42
        }
      },
      {
        key: 'edad',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.edad',
        configCelda: {
          width: 30
        }
      },
      {
        key: 'estadoProteccion',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.estado',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaAprobacion',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.aprobacion',
        configCelda: {
          width: 63
        }
      }
    ];

    /* Detalle */
    this.gridConfigDetalle.paginarDatos = true;
    this.gridConfigDetalle.columnas = [
      {
        key: 'nombre',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.cobertura',
        configCelda: {
          tipo: 'badge2',
          color: '_color',
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'proteccion',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.proteccion',
        configCelda: {
          tipo: 'link-currency',
          width: 70
        }
      },
      {
        key: 'cuota',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.cuota',
        configCelda: {
          tipo: 'currency',
          width: 55
        }
      },
      {
        key: 'factor',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.factor',
        configCelda: {
          width: 40
        }
      },
      {
        key: 'edad',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.edad',
        configCelda: {
          width: 30
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.estado',
        key: 'estadoProteccion',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaAprobacion',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.aprobacion',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'detalle',
        titulo: 'asociado.protecciones.portafolio.cobertura.grid.detalle',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-external-link text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 40
        }
      }
    ];
  }

}
