import { MimPlanCobertura } from './mim-plan-cobertura.model';

export class MimCondicion {

  codigo: string;
  mimPlanCobertura: MimPlanCobertura;
  aplicaPlanFamiliar: boolean;
  incrementoProteccion: boolean;
  disminucionProteccion: boolean;
  devolucionRetiro: boolean;
  requisitosMedicos: boolean;
  facturacion: boolean;
  tieneProyeccion: boolean;
  tieneEstadistica: boolean;
  renunciaAmparo: boolean;
  prorroga: boolean;
  disponibleParaGarantia: boolean;
  exoneracionPago: boolean;
  disminucionAnticipoPago: boolean;
  beneficiosPreexistencia: boolean;
  cancelar: boolean;
  rescate: boolean;
  aplicaSubsistencia: boolean;
  aplicaReactivacion: boolean;
  aplicaReingreso: boolean;
  aplicaRevocatoria: boolean;
  aplicaReceso: boolean;
  aplicaHabilitacion: boolean;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;

  constructor(objeto: IMimCondicion) {
    this.codigo = objeto && objeto.codigo || null;
    this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
    this.aplicaPlanFamiliar = objeto && objeto.aplicaPlanFamiliar || false;
    this.incrementoProteccion = objeto && objeto.incrementoProteccion || false;
    this.disminucionProteccion = objeto && objeto.disminucionProteccion || false;
    this.devolucionRetiro = objeto && objeto.devolucionRetiro || false;
    this.requisitosMedicos = objeto && objeto.requisitosMedicos || false;
    this.facturacion = objeto && objeto.facturacion || false;
    this.tieneProyeccion = objeto && objeto.tieneProyeccion || false;
    this.tieneEstadistica = objeto && objeto.tieneEstadistica || false;
    this.renunciaAmparo = objeto && objeto.renunciaAmparo || false;
    this.prorroga = objeto && objeto.prorroga || false;
    this.disponibleParaGarantia = objeto && objeto.disponibleParaGarantia || false;
    this.exoneracionPago = objeto && objeto.exoneracionPago || false;

    this.disminucionAnticipoPago = objeto && objeto.disminucionAnticipoPago || false;
    this.beneficiosPreexistencia = objeto && objeto.beneficiosPreexistencia || false;
    this.cancelar = objeto && objeto.cancelar || false;
    this.rescate = objeto && objeto.rescate || false;
    this.aplicaSubsistencia = objeto && objeto.aplicaSubsistencia || false;
    this.aplicaReactivacion = objeto && objeto.aplicaReactivacion || false;
    this.aplicaReingreso = objeto && objeto.aplicaReingreso || false;
    this.aplicaRevocatoria = objeto && objeto.aplicaRevocatoria || false;
    this.aplicaReceso = objeto && objeto.aplicaReceso || false;
    this.aplicaHabilitacion = objeto && objeto.aplicaHabilitacion || false;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaFin || null;
    this.estado = objeto && objeto.estado || false;
  }
}

export interface IMimCondicion {
  codigo: string;
  mimPlanCobertura: MimPlanCobertura;
  aplicaPlanFamiliar: boolean;
  incrementoProteccion: boolean;
  disminucionProteccion: boolean;
  devolucionRetiro: boolean;
  requisitosMedicos: boolean;
  facturacion: boolean;
  tieneProyeccion: boolean;
  tieneEstadistica: boolean;
  renunciaAmparo: boolean;
  prorroga: boolean;
  disponibleParaGarantia: boolean;
  exoneracionPago: boolean;
  disminucionAnticipoPago: boolean;
  beneficiosPreexistencia: boolean;
  cancelar: boolean;
  rescate: boolean;
  aplicaSubsistencia: boolean;
  aplicaReactivacion: boolean;
  aplicaReingreso: boolean;
  aplicaRevocatoria: boolean;
  aplicaReceso: boolean;
  aplicaHabilitacion: boolean;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
}
