import { MimCobertura } from './mim-cobertura.model';
import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimPlan } from './mim-plan.model';
import { IMimTipoSubsistencia, MimTipoSubsistencia } from './mim-tipo-subsistencia.model';

export class MimSubsistentePlanCobertura {
  codigo: number;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  mimTipoSubsistencia: MimTipoSubsistencia;
  subsistente: boolean;
  mimCobertura: MimCobertura;
  mimPlan: MimPlan;
  mimPlanCobertura: MimPlanCobertura;

  constructor(objeto: IMimSubsistentePlanCobertura) {
    this.codigo = objeto && objeto.codigo || null;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaInicio || null;
    this.estado = objeto && objeto.estado || false;
    this.mimTipoSubsistencia = objeto && objeto.mimTipoSubsistencia || null;
    this.subsistente = objeto && objeto.subsistente || false;
    this.mimCobertura = objeto && objeto.mimCobertura || null;
    this.mimPlan = objeto && objeto.mimPlan || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
  }

}

export interface IMimSubsistentePlanCobertura {
  codigo: number;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  mimTipoSubsistencia: IMimTipoSubsistencia;
  subsistente: boolean;
  mimCobertura: MimCobertura;
  mimPlan: MimPlan;
  mimPlanCobertura: MimPlanCobertura;
}
