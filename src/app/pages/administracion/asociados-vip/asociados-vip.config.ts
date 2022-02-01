import { MimGridConfiguracion } from './../../../shared/components/mim-grid/mim-grid-configuracion';
import { MimSearchAsociadoConfiguracion } from './../../../shared/components/mim-search-asociado/mim-search-asociado.component';

export class ConsultaAsociadosVIPConfig {

  gridAsociadosVip: MimGridConfiguracion = new MimGridConfiguracion();
  deshabilitarBotonAgregar = true;
  asociado: any;
  buscarAsociadoConfiguracion: MimSearchAsociadoConfiguracion = new MimSearchAsociadoConfiguracion();

  constructor() {
    this.gridAsociadosVip.scrollHorizontal = false;
    this.gridAsociadosVip.paginarDatos = true;
    this.gridAsociadosVip.esFiltra = true;

    this.gridAsociadosVip.columnas = [
      {
        key: 'nitCli',
        titulo: 'asociadosVIP.grid.numeroId',
        configCelda: {
          width: 150
        },
        typeFilter: 'text'
      },
      {
        key: 'nomCli',
        titulo: 'asociadosVIP.grid.nombres',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'desTipDoc',
        titulo: 'asociadosVIP.grid.tipoId',
        configCelda: {
          width: 150
        }
      },
      {
        key: 'desEstado',
        titulo: 'asociadosVIP.grid.estado',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'regionalAso',
        titulo: 'asociadosVIP.grid.regional',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'numInt',
        titulo: 'global.delete',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 130
        }
      }
    ];
  }
}
