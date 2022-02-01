import { MimTransaccionExclusion } from './mim-transaccion-exclusion';
import { MimCanalVentaExclusion } from './mim-canal-venta-exclusion';

export class MimExclusionPlanCoberturaDetalle {
  codigo: number;
  fechaModificacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  mimTransaccionExclusionList: MimTransaccionExclusion[];
  mimCanalVentaExclusionList: MimCanalVentaExclusion[];

  constructor(objeto: IMimExclusionPlanCoberturaDetalle) {
    this.codigo = objeto && objeto.codigo || null;
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaFin || null;
    this.estado = objeto && objeto.estado || false;
    this.mimTransaccionExclusionList = objeto && objeto.mimTransaccionExclusionList || null;
    this.mimCanalVentaExclusionList = objeto && objeto.mimCanalVentaExclusionList || null;
  }

}

export interface IMimExclusionPlanCoberturaDetalle {
  codigo: number;
  fechaModificacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  mimTransaccionExclusionList: MimTransaccionExclusion[];
  mimCanalVentaExclusionList: MimCanalVentaExclusion[];
}
