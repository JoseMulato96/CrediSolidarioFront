import { MimCobertura } from './mim-cobertura.model';
import { MimTipoValorProteccion } from './mim-tipo-valor-proteccion.model';

export class MimDesmembracionAccidente {
    mimTipoValorProteccion: MimTipoValorProteccion;
    mimCobertura: MimCobertura;
    desmembracion: any;
    pagoDesmembracionAccidental: number;
    fechaInicio: string;
    fechaFin: string;
    estado: boolean;

    constructor(objeto: IMimDesmembracionAccidente) {
        this.mimTipoValorProteccion = objeto && objeto.mimTipoValorProteccion || null;
        this.mimCobertura = objeto && objeto.mimCobertura || null;
        this.desmembracion = objeto && objeto.desmembracion || null;
        this.pagoDesmembracionAccidental = objeto && objeto.pagoDesmembracionAccidental || null;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
        this.estado = objeto && objeto.estado || null;
    }
}

export interface IMimDesmembracionAccidente {
    mimTipoValorProteccion: MimTipoValorProteccion;
    mimCobertura: MimCobertura;
    desmembracion: any;
    pagoDesmembracionAccidental: number;
    fechaInicio: string;
    fechaFin: string;
    estado: boolean;
}
