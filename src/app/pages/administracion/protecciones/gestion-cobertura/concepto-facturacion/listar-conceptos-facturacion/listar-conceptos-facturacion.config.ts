import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarConceptosFacturacionConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [

      {
        key: 'concepto',
        titulo: 'administracion.protecciones.gestionCobertura.conceptosFacturacion.grid.concepto',
        keyFiltro: 'conceptoFacturacion',
        typeFilter: 'textBack',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.gestionCobertura.conceptosFacturacion.grid.disponible',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.gestionCobertura.conceptosFacturacion.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 92,
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
