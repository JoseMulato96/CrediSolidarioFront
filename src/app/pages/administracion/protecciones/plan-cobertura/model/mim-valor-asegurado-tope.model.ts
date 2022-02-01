import { IMimPlanCobertura, MimPlanCobertura } from './mim-plan-cobertura.model';
import { IMimValorAsegurado, MimValorAsegurado } from './mim-valor-asegurado.model';
import { IMimNivelRiesgo, MimNivelRiesgo } from './mim-nivel-riesgo.model';
import { IMimTipoValorTope, MimTipoValorTope } from './mim-tipo-valor-tope.model';

export class MimValorAseguradoTope {

  codigo: number;
  mimValorAsegurado: MimValorAsegurado;
  mimNivelRiesgo: MimNivelRiesgo;
  mimTipoValorTopeUno: MimTipoValorTope;
  mimPlanCoberturaUno: MimPlanCobertura;
  valorMinimo: number;
  mimTipoValorTopeDos: MimTipoValorTope;
  mimPlanCoberturaDos: MimPlanCobertura;
  valorMaximo: number;

  constructor(obj: IMimValorAseguradoTope) {
    this.codigo = obj && obj.codigo || null;
    this.mimValorAsegurado = obj && obj.mimValorAsegurado || null;
    this.mimNivelRiesgo = obj && obj.mimNivelRiesgo || null;
    this.mimTipoValorTopeUno = obj && obj.mimTipoValorTopeUno || null;
    this.mimPlanCoberturaUno = obj && obj.mimPlanCoberturaUno || null;
    this.valorMinimo = obj && obj.valorMinimo || null;
    this.mimTipoValorTopeDos = obj && obj.mimTipoValorTopeDos || null;
    this.mimPlanCoberturaDos = obj && obj.mimPlanCoberturaDos || null;
    this.valorMaximo = obj && obj.valorMaximo || null;
  }
}

export class IMimValorAseguradoTope {
  codigo: number;
  mimValorAsegurado: IMimValorAsegurado;
  mimNivelRiesgo: IMimNivelRiesgo;
  mimTipoValorTopeUno: IMimTipoValorTope;
  mimPlanCoberturaUno: IMimPlanCobertura;
  valorMinimo: number;
  mimTipoValorTopeDos: IMimTipoValorTope;
  mimPlanCoberturaDos: IMimPlanCobertura;
  valorMaximo: number;
}
