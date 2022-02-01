
export class ConceptosDistribucionModel{
    codigo: number;
    descripcion: string;
    nombreCorto: string;
    vigencia: string

    constructor(obj: any) {
        this.codigo = obj? obj.number : null;
        this.descripcion = obj? obj.descripcion : null;
        this.nombreCorto = obj? obj.nombreCorto : null;
        this.vigencia = obj? obj.vigencia : null;
    }
}