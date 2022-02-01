export class ParametrosConfiguracionOperaciones {
    estado?: Estado;
    dataConfiguracionOperaciones?: any;
    listaCoberturas?: any;
    constructor(objeto?: IparametrosConfiguracionOperaciones) {
        this.estado = objeto && objeto.estado || null;
        this.dataConfiguracionOperaciones = objeto && objeto.dataConfiguracionOperaciones;
        this.listaCoberturas = objeto && objeto.listaCoberturas;
    }
}

export class IparametrosConfiguracionOperaciones {
    estado?: Estado;
    dataConfiguracionOperaciones?: any;
    listaCoberturas?: any;
}

export enum Estado {
    Guardado = 'guardado',
    Pendiente = 'pendiente'
}
