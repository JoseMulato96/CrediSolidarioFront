import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoRescate } from './mim-tipo-rescate.model';
import { MimCausaIndemnizacion } from './mim-causa-indemnizacion.model';
import { MimBeneficiarioPagoValorRescate } from './mim-beneficiario-pago-valor-rescate';

export class MimValorRescate {
    codigo: number;
    contribucionesMaximas: string;
    contribucionesMinimas: string;
    fechaModificacion: string;
    rentabilidad: number;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimValorRescatePlanCoberturaList: any;
    esAnticipoOtraCobertura: boolean;
    mimCausaIndemnizacion: MimCausaIndemnizacion;
    mimPlanCobertura: MimPlanCobertura;
    mimTipoRescateIndemnizacion: MimTipoRescate;
    estado: boolean;
    mimBeneficiarioPagoValorRescate: MimBeneficiarioPagoValorRescate;

    constructor(objeto: IMimValorRescate) {
        this.codigo = objeto && objeto.codigo || null;
        this.contribucionesMaximas = objeto && objeto.contribucionesMaximas || null;
        this.contribucionesMinimas = objeto && objeto.contribucionesMinimas || null;
        this.fechaModificacion = objeto && objeto.fechaModificacion || null;
        this.rentabilidad = objeto && objeto.rentabilidad || null;
        this.valor = objeto && objeto.valor || null;
        this.mimValorRescatePlanCoberturaList = objeto && objeto.mimValorRescatePlanCoberturaList || null;
        this.esAnticipoOtraCobertura = objeto && objeto.esAnticipoOtraCobertura || false;
        this.mimCausaIndemnizacion = objeto && objeto.mimCausaIndemnizacion || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.mimTipoRescateIndemnizacion = objeto && objeto.mimTipoRescateIndemnizacion || null;
        this.estado = objeto && objeto.estado || false;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;

    }
}

export class IMimValorRescate {
    codigo: number;
    contribucionesMaximas: string;
    contribucionesMinimas: string;
    fechaModificacion: string;
    rentabilidad: number;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimValorRescatePlanCoberturaList: any;
    esAnticipoOtraCobertura: boolean;
    mimCausaIndemnizacion: MimCausaIndemnizacion;
    mimPlanCobertura: MimPlanCobertura;
    mimTipoRescateIndemnizacion: MimTipoRescate;
    estado: boolean;
    mimBeneficiarioPagoValorRescate: MimBeneficiarioPagoValorRescate;
}
