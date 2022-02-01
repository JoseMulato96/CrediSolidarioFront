import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoLimitacion } from './mim-tipo-limitacion.model';

export class MimCondicionPagoAntiguedad {
    codigo: number;
    mimPlanCobertura: MimPlanCobertura;
    antiguedadMinima: number;
    antiguedadMaxima: number;
    mimTipoLimitacion: MimTipoLimitacion;
    valor: number;
    fechaFin: string;
    fechaInicio: string;
    fechaModificacion: string;
    estado: boolean;

    constructor(objeto: IMimCondicionPagoAntiguedad) {
        this.codigo = objeto && objeto.codigo || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.antiguedadMinima = objeto && objeto.antiguedadMinima || null;
        this.antiguedadMaxima = objeto && objeto.antiguedadMaxima || null;
        this.mimTipoLimitacion = objeto && objeto.mimTipoLimitacion || null;
        this.valor = objeto && objeto.valor || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaModificacion = objeto && objeto.fechaModificacion || null;
        this.estado = objeto && objeto.estado || false;
    }
}

export class IMimCondicionPagoAntiguedad {
  codigo: number;
  mimPlanCobertura: MimPlanCobertura;
  antiguedadMinima: number;
  antiguedadMaxima: number;
  mimTipoLimitacion: MimTipoLimitacion;
  valor: number;
  fechaFin: string;
  fechaInicio: string;
  fechaModificacion: string;
  estado: boolean;
}
