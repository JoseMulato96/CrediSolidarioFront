import { IValoresEvento } from './valores-evento.model';

export interface IDefinicionPagoEvento {
  asoNumInt?: string;
  procesoId?: string;
  tareaId?: string;
  codFaseFlujo?: number;
  subestados?: any[];
  fasesFlujo?: any[];
  solicitudEvento?: any;
  valoresEvento?: IValoresEvento;
  datosAsociado?: any;
  observacion?: string;
  liquidacionEvento?: any;
  codigoLiquidacion?: number;
  valorAPagar?: any;
  codigoSublimite?: string;
}

export class DefinicionPagoEvento implements IDefinicionPagoEvento {
  constructor(
      public asoNumInt?: string,
      public procesoId?: string,
      public tareaId?: string,
      public codFaseFlujo?: number,
      public subestados?: any[],
      public fasesFlujo?: any[],
      public solicitudEvento?: any,
      public valoresEvento?: IValoresEvento,
      public datosAsociado?: any,
      public observacion?: string,
      public liquidacionEvento?: any,
      public codigoLiquidacion?: number,
      public valorAPagar?: any,
      public codigoSublimite?: string
  ) {}
}
