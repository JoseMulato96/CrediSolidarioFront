import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarControlAreaTecnicaConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [

      {
        key: 'codigo',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.codigo',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimTipoMovimiento.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.tipoSolicitud',
        keyFiltro: 'nombreTipoSolicitud',
        typeFilter: 'textBack',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'mimNivelRiesgo.nombre',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.nivelRiesgo',
        keyFiltro: 'nombreNivelRiesgo',
        typeFilter: 'textBack',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_aplicaControlAreaTecnica',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.aplicaControlAreaTecnica',
        keyFiltro: 'aplicaControlAreaTecnicaLike',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.vigente',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        key: 'fechaInicio',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.fechaInicio',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaFin',
        titulo: 'administracion.protecciones.gestionPlanes.controlAreaTecnica.grid.fechaFin',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.gestionCobertura.conceptosFacturacion.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
