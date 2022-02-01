import { MimTipoValorCuota } from './mim-tipo-valor-cuota.model';

export class MimValorCuota {
    codigo: number;
    mimTipoValorCuota: MimTipoValorCuota;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: boolean;

    constructor(objeto: IMimValorCuota) {
        this.codigo = objeto && objeto.codigo || null;
        this.mimTipoValorCuota = objeto && objeto.mimTipoValorCuota || null;
        this.descripcion = objeto && objeto.descripcion || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.estado = objeto && objeto.estado || null;
    }
}

export interface IMimValorCuota {
    codigo: number;
    mimTipoValorCuota: MimTipoValorCuota;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    estado: boolean;
}
