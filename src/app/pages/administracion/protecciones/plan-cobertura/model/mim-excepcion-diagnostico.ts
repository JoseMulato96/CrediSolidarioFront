import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { SipDiagnosticos } from './sip-diagnosticos.model';
import { MimCondicionCobertura } from './mim-condicion-cobertura.model';

export class MimExcepcionDiagnostico {
    codigo: number;
    mimPlanCobertura: MimPlanCobertura;
    sipDiagnosticos: SipDiagnosticos;
    mimCondicionCobertura: MimCondicionCobertura;
    maximoDiasPagar: number;
    fechaFin: string;
    fechaInicio: string;
    fechaModificacion: string;
    estado: boolean;

    constructor(objeto: IMimExcepcionDiagnostico) {
        this.codigo = objeto && objeto.codigo || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.sipDiagnosticos = objeto && objeto.sipDiagnosticos || null;
        this.mimCondicionCobertura = objeto && objeto.mimCondicionCobertura || null;
        this.maximoDiasPagar = objeto && objeto.maximoDiasPagar || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaModificacion = objeto && objeto.fechaModificacion || null;
        this.estado = objeto && objeto.estado || false;
    }
}

export class IMimExcepcionDiagnostico {
  codigo: number;
  mimPlanCobertura: MimPlanCobertura;
  sipDiagnosticos: SipDiagnosticos;
  mimCondicionCobertura: MimCondicionCobertura;
  maximoDiasPagar: number;
  fechaFin: string;
  fechaInicio: string;
  fechaModificacion: string;
  estado: boolean;
}
