import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class RequisitosControlMedicoConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: '_fondos',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.fondo',
        typeFilter: 'textBack',
        keyFiltro: 'nombreFondo',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_requisitos',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.requisitoMedico',
        typeFilter: 'textBack',
        keyFiltro: 'nombreDocumentoRequisitoControlMedico',
        configCelda: {
          width: 126,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_transacciones',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.tipoTransaccion',
        typeFilter: 'textBack',
        keyFiltro: 'nombreTipoMovimiento',
        configCelda: {
          width: 126,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'edadMinima',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.edadMinima',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'edadMaxima',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.edadMaxima',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.vigencia',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.requisitosControlMedico.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      }
    ];
  }
}
