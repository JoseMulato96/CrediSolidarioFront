import { MimExclusion } from './mim-exclusion.model';
import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimExclusionPlanCoberturaDetalle } from './mim-exclusion-plan-cobertura-detalle.model';

export class MimExclusionPlanCobertura {
  fechaModificacion: string;
  estado: boolean;
  mimExclusion: MimExclusion;
  mimPlanCobertura: MimPlanCobertura;
  mimExclusionPlanCoberturaDetalleList: MimExclusionPlanCoberturaDetalle[];

  constructor(objeto: IMimExclusionPlanCobertura) {
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
    this.estado = objeto && objeto.estado || false;
    this.mimExclusion = objeto && objeto.mimExclusion || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.mimExclusionPlanCoberturaDetalleList = objeto && objeto.mimExclusionPlanCoberturaDetalleList || null;
  }

}

export interface IMimExclusionPlanCobertura {
  fechaModificacion: string;
  estado: boolean;
  mimExclusion: MimExclusion;
  mimPlanCobertura: MimPlanCobertura;
  mimExclusionPlanCoberturaDetalleList: MimExclusionPlanCoberturaDetalle[];
}
