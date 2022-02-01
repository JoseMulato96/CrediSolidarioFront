import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoValorDevolver } from './mim-tipo-valor-devolver.model';

export class MimBeneficioPreexistencia {
    codigo: number;
    mimPlanCobertura: MimPlanCobertura;
    antiguedadMaxima: number;
    antiguedadMinima: number;
    mimTipoValorDevolver: MimTipoValorDevolver;
    valor: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;

    constructor(objeto: IMimBeneficioPreexistencia) {
        this.codigo = objeto && objeto.codigo || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.antiguedadMaxima = Object && objeto.antiguedadMaxima || null;
        this.antiguedadMinima = Object && objeto.antiguedadMinima || null;
        this.mimTipoValorDevolver = objeto && objeto.mimTipoValorDevolver || null;
        this.valor = objeto && objeto.valor || null;
        this.estado = objeto && objeto.estado || false;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
      }
  }

  export interface IMimBeneficioPreexistencia {
    codigo: number;
    mimPlanCobertura: MimPlanCobertura;
    antiguedadMaxima: number;
    antiguedadMinima: number;
    mimTipoValorDevolver: MimTipoValorDevolver;
    valor: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;
  }
