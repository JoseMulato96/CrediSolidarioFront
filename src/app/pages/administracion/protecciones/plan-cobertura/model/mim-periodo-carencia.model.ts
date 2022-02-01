import { MimPlanCobertura, IMimPlanCobertura } from './mim-plan-cobertura.model';
import { MimUnidadTiempo, IMimUnidadTiempo } from './mim-unidad-tiempo.model';
import { MimCausa, IMimCausa } from './mim-causa.model';

export class MimPeriodoCarencia {

  codigo: string;
  periodoCarencia: string;
  mimPlanCobertura: MimPlanCobertura;
  mimUnidadTiempo: MimUnidadTiempo;
  mimCausa: MimCausa;
  contribuciones: number;
  fechaAplicacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;

  constructor(objeto: IMimPeriodoCarencia) {
    this.codigo = objeto && objeto.codigo || null;
    this.periodoCarencia = objeto && objeto.periodoCarencia || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.mimUnidadTiempo = objeto && objeto.mimUnidadTiempo || null;
    this.mimCausa = objeto && objeto.mimCausa || null;
    this.contribuciones = objeto && objeto.contribuciones || null;
    this.fechaAplicacion = objeto && objeto.fechaAplicacion || null;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaFin || null;
    this.estado = objeto && objeto.estado || false;
  }
}

export interface IMimPeriodoCarencia {
  codigo: string;
  periodoCarencia: string;
  mimPlanCobertura: IMimPlanCobertura;
  mimUnidadTiempo: IMimUnidadTiempo;
  mimCausa: IMimCausa;
  contribuciones: number;
  fechaAplicacion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
}
