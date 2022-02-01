import { MimPlan } from './mim-plan.model';
import { MimTipoPlan } from './mim-tipo-plan.model';

export class MimPlanObligatorio {

  codigo: number;
  mimPlan:MimPlan;
  mimPlanObliga: MimPlan;
  mimTipoPlan: MimTipoPlan;
  fechaInicio:String;
  fechaFin:String;
  estado:boolean;

  constructor(obj: IMimPlanObligatorio) {
    this.codigo = obj && obj.codigo || null;
    this.mimPlan = obj && obj.mimPlan || null;
    this.mimPlanObliga = obj && obj.mimPlanObliga || null;
    this.mimTipoPlan = obj && obj.mimTipoPlan || null;
    this.fechaInicio = obj && obj.fechaInicio || null;
    this.fechaFin = obj && obj.fechaFin || null;
    this.estado = obj && obj.estado || null;
  }
}

export class IMimPlanObligatorio {
  codigo: number;
  mimPlan:MimPlan;
  mimPlanObliga: MimPlan;
  mimTipoPlan: MimTipoPlan;
  mimTipoMovimiento:any;
  fechaInicio:String;
  fechaFin:String;
  estado:boolean;
}
