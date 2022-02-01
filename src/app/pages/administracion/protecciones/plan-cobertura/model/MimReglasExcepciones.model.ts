export class MimReglasExcepciones {
    codigo: any;
    codigoTipoMovimiento: any;
    codigoCondicion: any;
    codigoRolAprobador: any;
    codigoPlanCobertura: any;
    estado: boolean;
    permitirExcepcion: boolean;

    constructor(object: IMimReglasExcepciones) {
        this.codigo = object && object.codigo || null;
        this.codigoTipoMovimiento = object && object.codigoTipoMovimiento || null;
        this.codigoCondicion = object && object.codigoCondicion || null;
        this.codigoRolAprobador = object && object.codigoRolAprobador || null;
        this.codigoPlanCobertura = object && object.codigoPlanCobertura || null;
        this.estado = object && object.estado || null;
        this.permitirExcepcion = object && object.permitirExcepcion || null;
    }
}


export class IMimReglasExcepciones {
    codigo: any;
    codigoTipoMovimiento: any;
    codigoCondicion: any;
    codigoRolAprobador: any;
    codigoPlanCobertura: any;
    estado: boolean;
    permitirExcepcion: boolean;
}