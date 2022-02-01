import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';

export class ListarCartasConfig {

  gridCartas: MimGridConfiguracion = new MimGridConfiguracion();
  barFilter: MimFiltroVerticalComponentConfig = {};

  constructor() {
    this.gridCartas.selectMode = true;
    this.gridCartas.scrollHorizontal = true;

    this.gridCartas.esFiltra = true;

    this.gridCartas.paginarDatos = true;
    this.gridCartas.pagina = 0;
    this.gridCartas.datos = [];
    this.gridCartas.mostrarPaginador = true;

    this.gridCartas.columnas = [
      {
        key: 'codigoCartasFTP',
        titulo: 'reportes.cartas.grid.noCarta',
        configCelda: {
          width: 50
        }
      },
      {
        key: 'codigoProceso',
        titulo: 'reportes.cartas.grid.noEvento',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'nombreParametroCarta',
        titulo: 'reportes.cartas.grid.nombreCarta',
        configCelda: {
          width: 160
        }
      },
      {
        key: 'mimSolicitud.mimTipoSolicitud.nombre',
        titulo: 'reportes.cartas.grid.evento',
        typeFilter: 'multiselect',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'mimSolicitud.nombre',
        titulo: 'reportes.cartas.grid.solicitud',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'fechaCreacion',
        titulo: 'reportes.cartas.grid.fechaCreacion',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'asociado.nombreAsociado',
        titulo: 'reportes.cartas.grid.asociado',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'asociado.nitCli',
        titulo: 'reportes.cartas.grid.cedula',
        configCelda: {
          width: 80
        }
      },
      {
        key: 'editar',
        titulo: 'global.actions',
        configCelda: {
          buttonTooltip: 'Editar',
          tipo: 'button',
          cssIcon: 'icon-document-edit text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 35,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 4
          },
          funDisabled: this.bloquearBotonEditar
        }
      },
      {
        key: 'ver',
        configCelda: {
          buttonTooltip: 'Ver',
          tipo: 'button',
          cssIcon: 'icon-eye text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 35,
          combinarCeldas: {
            omitir: true
          }
        }
      },
      {
        key: 'imprimir',
        configCelda: {
          buttonTooltip: 'Imprimir',
          tipo: 'button',
          cssIcon: 'icon-file-text text--blue1',
          cssButton: 'btn btn--icon text--blue2 mx-auto',
          width: 35,
          combinarCeldas: {
            omitir: true
          }
        }
      },
      {
        key: 'validado',
        configCelda: {
          buttonTooltip: 'Validar',
          tipo: 'button',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          cssKey: 'validado',
          width: 35,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBotonValidar,
          funCss: this.cambiarIconoValidar
        }
      }
    ];
  }

  bloquearBotonEditar(carta: any): boolean {
    if (carta.mimSolicitud.mimTipoSolicitud.codigo === MIM_PARAMETROS.MIM_FASE_PROCESO.PROCESO_VENTA_INCREMENTO) {
      return true;
    }
    // Se valida directamente contra true para evitar validar simplemente que no sea nulo o indefinido.
    return carta.validado === 'true' || carta.validado === true;
  }

  bloquearBotonValidar(carta: any) {
    if (carta.mimSolicitud.mimTipoSolicitud.codigo === MIM_PARAMETROS.MIM_FASE_PROCESO.PROCESO_VENTA_INCREMENTO) {
      return true;
    }
    // Se valida directamente contra true para evitar validar simplemente que no sea nulo o indefinido.
    return carta.validado === 'true' || carta.validado === true;
  }

  cambiarIconoValidar(validado: any) {
    let color = [];
    if (validado === 'true') {
      color = ['icon-check-square text--red1'];
    } else {
      color = ['icon-square text--red1'];
    }
    return color;
  }

}
