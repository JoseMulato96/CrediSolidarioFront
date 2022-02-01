import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimEnfermedadGrave } from './mim-enfermedad-grave.model';
import { MimTipoValorProteccion } from './mim-tipo-valor-proteccion.model';

export class MimEnfermedadGravePlanCobertura {

    mimPlanCobertura: MimPlanCobertura;
    mimEnfermedadGrave: MimEnfermedadGrave;
    mimTipoValorProteccion: MimTipoValorProteccion;
    valor: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;

    constructor(objeto: IMimEnfermedadGravePlanCobertura) {
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.mimEnfermedadGrave = Object && objeto.mimEnfermedadGrave || null;
        this.mimTipoValorProteccion = objeto && objeto.mimTipoValorProteccion || null;
        this.valor = objeto && objeto.valor || null;
        this.estado = objeto && objeto.estado || false;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
      }

}


export interface IMimEnfermedadGravePlanCobertura {
    mimPlanCobertura: MimPlanCobertura;
    mimEnfermedadGrave: MimEnfermedadGrave;
    mimTipoValorProteccion: MimTipoValorProteccion;
    valor: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;
}
