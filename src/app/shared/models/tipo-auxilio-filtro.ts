import {
  IPulldownAuxilioFiltro,
  IPulldownAccionFiltro,
  IPulldownCorteFiltro
} from '@shared/interfaces/i-pulldown-filtro';

export class TipoAuxilioFiltro {
  tipoAuxilio?: IPulldownAuxilioFiltro;
  tipoAccion?: IPulldownAccionFiltro;
  corte?: IPulldownCorteFiltro;
}
