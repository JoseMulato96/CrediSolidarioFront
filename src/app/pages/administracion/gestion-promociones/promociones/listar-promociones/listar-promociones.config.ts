import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarPromocionesConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListar.scrollHorizontal = true;
    this.gridListar.ordenamientoPersonalizado = true;
    this.gridListar.esFiltra = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.nombrePromocion',
        key: 'nombre',
        typeFilter: 'textBack',
        keyFiltro: 'nombrePromocion',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.beneficio',
        key: 'mimBeneficio.nombre',
        typeFilter: 'textBack',
        keyFiltro: 'nombreBeneficio',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.valorBeneficio',
        key: 'valorBeneficio',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.estado',
        key: '_estado',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.fechaInicio',
        key: 'fechaInicio',
        keyFiltro: 'fechaInicioComienzo,fechaInicioFinal',
        typeFilter: 'date',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.fechaFin',
        key: 'fechaFin',
        keyFiltro: 'fechaFinComienzo,fechaFinFinal',
        typeFilter: 'date',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.gestionPromociones.promociones.grid.accion',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60
        }
      },

    ];
  }
}
