import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarValoresFondoConfig {

  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = false;
    this.gridConfig.paginarDatos = true;
    this.gridConfig.esFiltra = false;
    this.gridConfig.columnas = [
      {
        key: 'estadoAsociado',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.estadoAsociado',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'beneficiarioCobertura',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.beneficiarioCobertura',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'edadInicio',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.edadInicio',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'edadFinal',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.edadFin',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'valor',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.valorDestinadoFondo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true,
          tipo: 'numero'
        }
      },
      {
        key: 'fechaModificacion',
        titulo: 'administracion.protecciones.campanasCobertura.guardar.grid.fechaModificacion',
        configCelda: {
          width: 100,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.protecciones.campanasCobertura.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 30,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          },
          funDisabled: this.habilitarOpciones
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 20,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.habilitarOpciones
        }
      }
    ];
  }

  habilitarOpciones(valor: any) {
    return valor._habilitaValor;
  }
}
