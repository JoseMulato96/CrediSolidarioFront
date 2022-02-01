import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MIM_PARAMETROS } from './../../../../../../shared/static/constantes/mim-parametros';

export class ListarCoberturasConfig {

  gridListarCoberturas: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarCoberturas.scrollHorizontal = true;
    this.gridListarCoberturas.ordenamientoPersonalizado = true;
    this.gridListarCoberturas.esFiltra = true;
    this.gridListarCoberturas.columnas = [
      {
        titulo: 'administracion.protecciones.coberturas.grid.fondo',
        key: 'mimFondo.nombre',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 190,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.coberturas.grid.codigoCobertura',
        key: 'codigo',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.coberturas.grid.nombre',
        key: 'nombre',
        keyFiltro: 'nombreCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      /* {
        titulo: 'administracion.protecciones.coberturas.grid.origen',
        key: 'mimOrigenCobertura.nombre',
        configCelda: {
          width: 90,
          habilitarOrdenamiento: true
        }
      }, */
      {
        titulo: 'administracion.protecciones.coberturas.grid.estadoCobertura',
        key: 'mimEstadoCobertura.nombre',
        keyFiltro: 'nombreEstadoCobertura',
        typeFilter: 'textBack',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.coberturas.grid.fechaModificacion',
        configCelda: {
          width: 140,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.coberturas.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          },
          funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'eliminar',
        configCelda: {
        tipo: 'button',
        cssIcon: 'icon-trash-3 text--red1',
        cssButton: 'btn btn--icon bg--red2 mx-auto',
        width: 60,
          combinarCeldas: {
          omitir: true
          },
        funDisabled: this.bloquearBoton
       }
      }
    ];
  }

  bloquearBoton(cobertura: any) {
    return cobertura.mimEstadoCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_COBERTURA.INACTIVO ||
    cobertura.mimEstadoCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_COBERTURA.OBSERVACION;
  }

  bloquearBotonEditar(cobertura: any) {
    return cobertura.mimEstadoCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_COBERTURA.OBSERVACION;
  }
}
