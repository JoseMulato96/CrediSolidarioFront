export class MimCondicionesVentaPlanCobertura {

    mimTiempoAntiguedad: any;
    mimTipoSolicitud: any;
    numeroContribuciones: number;
    antiguedad: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;

    constructor(objeto: IMimCondicionesVentaPlanCobertura) {
        this.mimTiempoAntiguedad = objeto && objeto.mimTiempoAntiguedad || null;
        this.mimTipoSolicitud = Object && objeto.mimTipoSolicitud || null;
        this.numeroContribuciones = objeto && objeto.numeroContribuciones || null;
        this.antiguedad = objeto && objeto.antiguedad || null;
        this.estado = objeto && objeto.estado || false;
        this.fechaInicio = objeto && objeto.fechaInicio || null;
        this.fechaFin = objeto && objeto.fechaFin || null;
      }
}

export interface IMimCondicionesVentaPlanCobertura {
    mimTiempoAntiguedad: any;
    mimTipoSolicitud: any;
    numeroContribuciones: number;
    antiguedad: number;
    estado: boolean;
    fechaInicio: string;
    fechaFin: string;
}
