import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { PopupMenuConfig } from '@shared/components/popup-menu/popup-menu.component';

export class ConsultaEventosConfig {

  gridEvento: MimGridConfiguracion = new MimGridConfiguracion();
  popupMenu: PopupMenuConfig = new PopupMenuConfig();

  constructor() {
    this.gridEvento.scrollHorizontal = true;
    this.gridEvento.paginarDatos = true;
    this.gridEvento.esFiltra = true;
    this.gridEvento.columnas = [
      {
        key: 'recCodigo',
        titulo: 'eventos.consulta.grid.solicitud',
        configCelda: {
          width: 100, tipo: 'link'
        },
        typeFilter: 'text'
      },
      {
        key: 'recFechaEvento',
        titulo: 'eventos.consulta.grid.fechaEvento',
        configCelda: {
          width: 70
        },
        typeFilter: 'text'
      },
      {
        key: 'diagCod',
        titulo: 'eventos.consulta.grid.diag',
        configCelda: {
          width: 50
        },
        typeFilter: 'text'
      },
      {
        key: 'recLateralidadNombre',
        titulo: 'eventos.consulta.grid.lt',
        configCelda: {
          width: 50
        },
        typeFilter: 'text'
      },
      {
        key: 'recEstadoNombre',
        titulo: 'eventos.consulta.grid.estado',
        configCelda: {
          tipo: 'badge',
          cssKey: 'recEstadoNombreCorto',
          funCss: this.calcularClaseEstadoFacturacion,
          width: 130
        },
        typeFilter: 'multiselect'
      },
      {
        key: 'tipoAuxDescripcion',
        titulo: 'eventos.consulta.grid.auxilioReclamo',
        configCelda: {
          width: 170
        },
        typeFilter: 'text'
      },
      {
        key: 'asignadoA',
        titulo: 'eventos.consulta.grid.asignado',
        configCelda: {
          width: 160
        },
        typeFilter: 'text'
      },
      {
        key: 'more',
        titulo: 'eventos.consulta.grid.mas',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-dots-3 text--gray1 r-90',
          cssButton: 'btn btn--icon btn-light',
          width: 40
        }
      }
    ];
  }

  calcularClaseEstadoFacturacion(estado: string) {
    let color: string[] = ['bg--gray1'];

    if ([
      'RECLA_PENDOC',
      'RECLA_SOLI',
      'RECLA_PENAY',
      'RECLA_PENCJ',
      'RECLA_PENPI',
      'RECLA_PENPAM',
      'RECLA_DEV_AN',
      'RECLA_DEV_AU',
      'RECLA_PENINFRAD',
      'RECLA_PENERRRAD',
      'RECLA_DEVSIS',
      'CON_DIR_LIQ',
      'DEV_ERR_RAD',
      'SOL_INF_ADI',
      'NOT CEN CONTAC',
      'NOT BARRA',
      'NOT OFI VIRTUAL',
      'RENDOCDES',
      'RENDOCING',
      'RENOENFGRAVE',
      'PEDPERPER',
      'NOTCAC',
      'NOTZONA',
      'NOTSERCO',
      'NOTSERCO',
      'RENDPLANE'
    ].includes(estado)) {
      color = ['bg--orange1'];
    } else if ([
      'RECLA_APRO',
      'RECLA_PAG',
      'RECLA_PAG_FRAC',
      'NOTPAGO',
      'NOTPAGO',
      'NOTPAGO',
      'NOTPAGO',
      'FINAUTO',
      'FL_PAGADA'
    ].includes(estado)) {
      color = ['bg--green1'];
    } else if ([
      'RECLA_ACT',
      'RECLA_TRATES',
      'RECLA_REVDIR',
      'RECLA_LIQU',
      'RECLA_CON_AN',
      'REC_PEN_RAD',
      'VAL_DEV',
      'LIQ_DEV',
      'APR_LIQ_DEV',
      'REV_DEV',
      'RENDES',
      'RENDISING',
      'RENOENF',
      'RENPLANE',
      'FL_PROCESO'
    ].includes(estado)) {
      color = ['bg--yellow1'];
    } else if ([
      'RECLA_RECNE',
      'RECLA_OBJET',
      'RECLA_TERM_OBJ',
      'NOT_NEG_DEV',
      'FL_NEGADA'
    ].includes(estado)) {
      color = ['bg--red1'];
    } else if ([
      'NOT_PAG_DEV'
    ].includes(estado)) {
      color = ['bg--green2'];
    } else if ([
      'RECLA_ANU',
      'FL_ANULADA'
    ].includes(estado)) {
      color = ['bg--gray2'];
    }
    return color;
  }
}
