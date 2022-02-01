import { MimPlanCobertura, IMimPlanCobertura } from './mim-plan-cobertura.model';
import { MimAsistenciaPlanCoberturaDetalle, IMimAsistenciaPlanCoberturaDetalle } from './mim-asistencia-plan-cobertura-detalle.model';

export class MimAsistenciaPlanCobertura {

  codigo: number;
  nombreAsistencia: string;
  estado: boolean;
  mimPlanCobertura: MimPlanCobertura;
  mimAsistenciaPlanCoberturaDetalleList: MimAsistenciaPlanCoberturaDetalle[];
  fechaModificacion?: string;

  constructor(objeto: IMimAsistenciaPlanCobertura) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombreAsistencia = objeto && objeto.nombreAsistencia || null;
    this.estado = objeto && objeto.estado || false;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.mimAsistenciaPlanCoberturaDetalleList = objeto && objeto.mimAsistenciaPlanCoberturaDetalleList || null;
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
  }

}

export interface IMimAsistenciaPlanCobertura {
  codigo: number;
  nombreAsistencia: string;
  estado: boolean;
  mimPlanCobertura: IMimPlanCobertura;
  mimAsistenciaPlanCoberturaDetalleList: IMimAsistenciaPlanCoberturaDetalle[];
  fechaModificacion?: string;
}
