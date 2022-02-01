import { IMimPlanCobertura, MimPlanCobertura } from './mim-plan-cobertura.model';

export class MimPlanCoberturaEdad {

  codigo: number;
  mimPlanCobertura: MimPlanCobertura;
  mimPlanCoberturaRelacionado: MimPlanCobertura;
  edadMinIngreso: number;
  edadMaxIngreso: number;
  edadIndemnizacion: number;
  edadMaxPermanencia: number;
  plazo: number;
  fondoGarantia: boolean;
  renovacion: boolean;

  constructor(obj: IMimPlanCoberturaEdad) {
    this.codigo = obj && obj.codigo || null;
    this.mimPlanCobertura = obj && obj.mimPlanCobertura || null;
    this.mimPlanCoberturaRelacionado = obj && obj.mimPlanCoberturaRelacionado || null;
    this.edadMinIngreso = obj && obj.edadMinIngreso || null;
    this.edadMaxIngreso = obj && obj.edadMaxIngreso || null;
    this.edadIndemnizacion = obj && obj.edadIndemnizacion || null;
    this.edadMaxPermanencia = obj && obj.edadMaxPermanencia || null;
    this.plazo = obj && obj.plazo || null;
    this.fondoGarantia = obj && obj.fondoGarantia || false;
    this.renovacion = obj && obj.renovacion || false;
  }
}

export class IMimPlanCoberturaEdad {
  codigo: number;
  mimPlanCobertura: IMimPlanCobertura;
  mimPlanCoberturaRelacionado: IMimPlanCobertura;
  edadMinIngreso: number;
  edadMaxIngreso: number;
  edadIndemnizacion: number;
  edadMaxPermanencia: number;
  plazo: number;
  fondoGarantia: boolean;
  renovacion: boolean;
}
