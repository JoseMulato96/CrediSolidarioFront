import { MimCausa } from './mim-causa.model';
import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoReconocido } from './mim-tipo-reconocido.model';

export class MimCondicionesPagarEvento {

    codigo: number;
    estado: boolean;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimPlanCobertura: MimPlanCobertura;
    mimCausa: MimCausa;
    mimUnidad: MimTipoReconocido;


    constructor(objeto: IMimCondicionesPagarEvento) {
        this.estado = objeto && objeto.estado || null;
        this.valor = objeto && objeto.valor || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.mimCausa = objeto && objeto.mimCausa || null;
        this.codigo = objeto && objeto.codigo || null;
        this.mimUnidad = objeto && objeto.mimUnidad || null;
    }

}

export interface IMimCondicionesPagarEvento {
    codigo: number;
    estado: boolean;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimPlanCobertura: MimPlanCobertura;
    mimCausa: MimCausa;
    mimUnidad: MimTipoReconocido;
}
