import { ProductoAsociadoDetalle } from './producto-asociado-detalle.model';

export class ProductoAsociado {
  prodDescripcion?: string;
  proCod?: number;
  proCuotaAcumulada?: number;
  proProteccionAcumulada?: number;
  cuota?: number;
  proEstado?: string;
  asoNumInt?: number;
  prodCodigo?: number;
  descEstado?: string;
  fechaPerseverancia?: string;
  perseverancia?: string;
  proteccionEventoDtoList?: ProductoAsociadoDetalle[];

  _selected: boolean;
}
