import { MimPlanCobertura } from './mim-plan-cobertura.model';
import { MimTipoReconocido } from './mim-tipo-reconocido.model';
import { MimTipoSublimite } from './mim-tipo-sublimite.model';
import { MimPresentacionProtafolio } from './presentacion-portafolio.model';

export class MimSublimiteCobertura {

    codigo: number;
    nombre: string;
    estado: boolean;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimPlanCobertura: MimPlanCobertura;
    mimTipoSublimites: MimTipoSublimite;
    mimTipoReconocido?: MimTipoReconocido;
    mimPresentacionPortafolio: MimPresentacionProtafolio


    constructor(objeto: IMimSublimiteCobertura) {
        this.nombre = objeto && objeto.nombre || null;
        this.estado = objeto && objeto.estado || null;
        this.valor = objeto && objeto.valor || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.mimPlanCobertura = objeto && objeto.mimPlanCobertura || null;
        this.mimTipoSublimites = objeto && objeto.mimTipoSublimites || null;
        this.codigo = objeto && objeto.codigo || null;
        this.mimTipoReconocido = objeto && objeto.mimTipoReconocido || null;
        this.mimPresentacionPortafolio = objeto && objeto.mimPresentacionPortafolio || null;


    }

}

export interface IMimSublimiteCobertura {
    codigo: number;
    nombre: string;
    estado: boolean;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    mimPlanCobertura: MimPlanCobertura;
    mimTipoSublimites: MimTipoSublimite;
    mimTipoReconocido?: MimTipoReconocido
    mimPresentacionPortafolio: MimPresentacionProtafolio;
}
