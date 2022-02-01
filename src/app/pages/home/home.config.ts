import {
  IPulldownAccionFiltro,
  IPulldownSolicitudFiltro,
  IPulldownAuxilioFiltro,
  IPulldownCorteFiltro
} from '@shared/interfaces/i-pulldown-filtro';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class HomeConfig {
  tiposAuxilios: IPulldownAuxilioFiltro[] = [];
  _autocompleteTiposAuxilios: IPulldownCorteFiltro[] = [];
  auxilioTiposAcciones: IPulldownAccionFiltro[] = [];
  _autocompleteAuxilioTiposAcciones: IPulldownCorteFiltro[] = [];
  monetarioTiposAcciones: IPulldownAccionFiltro[] = [];
  _autocompleteMonetarioTiposAcciones: IPulldownCorteFiltro[] = [];
  cortes: IPulldownCorteFiltro[] = [];
  _autocompleteCortes: IPulldownCorteFiltro[] = [];
  tipoSolicitudes: IPulldownSolicitudFiltro[] = [];
  _autocompleteTipoSolicitudes: IPulldownCorteFiltro[] = [];

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();
  constructor() {
    this.gridListar.scrollHorizontal = false;
    this.gridListar.paginarDatos = true;
    this.gridListar.esFiltra = true;
    this.gridListar.tamano = 10;

    this.gridListar.columnas = [
      {
        titulo: 'home.grid.noSolicitud',
        key: '_processInstanceId',
        configCelda: {
          width: 85,
          tipo: 'link',
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.identificacion',
        key: 'variables.identificacionAsociado',
        configCelda: {
          width: 80
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.nombreAsociado',
        key: 'variables.nombreAsociado',
        configCelda: {
          width: 160,
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.producto',
        key: 'variables.nombreSolicitud',
        configCelda: {
          width: 160,
          cssButton: 'btn btn--icon bg--blue2 mx-auto'
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.tipoSolicitud',
        key: 'variables.tipoSolicitud',
        configCelda: {
          width: 100,
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.dias',
        key: 'daysManagement',
        configCelda: {
          width: 40,
          tipo: 'badge2',
          color: '_color'
        },
        typeFilter: 'text'
      },
      {
        titulo: 'home.grid.accion',
        key: 'name',
        configCelda: {
          width: 140,
        },
        typeFilter: 'text'
      },

      {
        titulo: 'home.grid.docs',
        key: 'docs',
        configCelda: {
          tipo: 'button',
          width: 50,
          cssIcon: 'icon-document text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Notificación manual digitalización documentos',
          funDisabled: this.bloquearBotonDocs
        }
      }
    ];
  }

  bloquearBotonDocs(item: any) {
    return item.taskDefinitionKey !== 'digitalizarDocumentos';
  }
}
