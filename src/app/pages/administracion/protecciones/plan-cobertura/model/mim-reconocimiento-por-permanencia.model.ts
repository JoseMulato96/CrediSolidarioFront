export class MimReconocimientoPorPermanencia {

    codigo: number;
    valorReconocimiento: any;
    unidad: any;
    edadIngreso: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;

    constructor(objeto: IMimReconocimientoPorPermanencia) {
        this.codigo = objeto && objeto.codigo || null;
        this.valorReconocimiento = objeto && objeto.valorReconocimiento || null;
        this.unidad = Object && objeto.unidad || null;
        this.edadIngreso = objeto && objeto.edadIngreso || null;
        this.estado = objeto && objeto.estado || false;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
      }
}

export interface IMimReconocimientoPorPermanencia {
    codigo: number;
    valorReconocimiento: number;
    unidad: any;
    edadIngreso: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;
}
