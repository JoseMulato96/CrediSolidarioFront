import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { PopupMenuConfig } from '@shared/components/popup-menu/popup-menu.component';

export class MovimientosConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
  popupMenu: PopupMenuConfig = new PopupMenuConfig();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.paginarDatos = false;

  }

  columnsAll() {
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.noDoc',
        configCelda: {
          width: 85,
          tipo: 'link'
        }
      },
      {
        key: 'mimTipoMovimiento.nombre',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.tipoSolicitud',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigoCotizacion',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.codigoCotizacion',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaSolicitud',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.fechaSolicitud',
        configCelda: {
          width: 65,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.solicitud',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.fechaVigencia',
        key: 'fechaVigencia',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombreEstado',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.estado',
        configCelda: {
          tipo: 'badge2',
          color: 'codigoColorEstado',
          width: 95,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_nombreFaseFlujo',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.fase',
        configCelda: {
          tipo: 'badge2',
          color: '_codigoColorFase',
          width: 95,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'asociado.protecciones.portafolio.movimientos.grid.mas',
        titulo: 'Más',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-dots-3 text--gray1 r-90',
          cssButton: 'btn btn--icon btn-light',
          width: 35
        }
      }
    ];
  }

  columnMinimo() {
    this.gridConfig.columnas = [
      {
        key: 'codigo',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.noDoc',
        configCelda: {
          width: 85,
          tipo: 'link'
        }
      },
      {
        key: 'mimTipoMovimiento.nombre',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.movimiento',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigoCotizacion',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.codigoCotizacion',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaSolicitud',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.fechaSolicitud',
        configCelda: {
          width: 65,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimPlan.nombre',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.plan',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.fechaVigencia',
        key: 'fechaVigencia',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'nombreEstado',
        titulo: 'asociado.protecciones.portafolio.movimientos.grid.estado',
        configCelda: {
          tipo: 'badge2',
          color: 'codigoColorEstado',
          width: 95,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'asociado.protecciones.portafolio.movimientos.grid.mas',
        titulo: 'Más',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-dots-3 text--gray1 r-90',
          cssButton: 'btn btn--icon btn-light',
          width: 35
        }
      }
    ];
  }

}
