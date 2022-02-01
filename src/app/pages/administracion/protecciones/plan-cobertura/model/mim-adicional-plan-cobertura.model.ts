import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimCobertura } from './mim-cobertura.model';
import { MimPlan } from './mim-plan.model';

export class MimAdicionalPlanCobertura {

  codigo: number;
  mimPlan: MimPlan;
  mimCobertura: MimCobertura;
  mimPlanCobertura: MimPlanCobertura;
  estado: boolean;
  fechaInicio: string;
  fechaFin: string;



  constructor(objeto: IMimAdicionalPlanCobertura) {
    this.codigo = objeto && objeto.codigo || null;
    this.mimPlan = objeto && objeto.mimPlan || null;
    this.mimCobertura = objeto && objeto.mimCobertura || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.estado = objeto && objeto.estado || false;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaInicio || null;
  }

}

export interface IMimAdicionalPlanCobertura {
  codigo: number;
  mimPlan: MimPlan;
  mimCobertura: MimCobertura;
  mimPlanCobertura: MimPlanCobertura;
  estado: boolean;
  fechaInicio: string;
  fechaFin: string;
}
