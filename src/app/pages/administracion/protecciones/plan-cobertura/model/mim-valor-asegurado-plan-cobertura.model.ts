import { IMimPlanCobertura, MimPlanCobertura } from './mim-plan-cobertura.model';
import { IMimValorAsegurado, MimValorAsegurado } from './mim-valor-asegurado.model';

export class MimValorAseguradoPlanCobertura {

  mimValorAsegurado: MimValorAsegurado;
  mimPlanCobertura: MimPlanCobertura;

  constructor(obj: IMimValorAseguradoPlanCobertura) {
    this.mimValorAsegurado = obj && obj.mimValorAsegurado || null;
    this.mimPlanCobertura = obj && obj.mimPlanCobertura || null;
  }
}

export class IMimValorAseguradoPlanCobertura {
  mimValorAsegurado: IMimValorAsegurado;
  mimPlanCobertura: IMimPlanCobertura;
}
