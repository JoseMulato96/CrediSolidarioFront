export class CargueMasivoFactoresModel{
    codigoCobertura: string;
    codigoTipoFactor: string;
    descripcion: string;
    edadMinima: number;
    edadMaxima: number;
    archivo: string;
    fechaVigencia: string;
    fechaHoraCargue: string;
    totalDatos: number;

    constructor(obj: any) {
        this.codigoCobertura = obj ? obj.codigoCobertura : null;
        this.codigoTipoFactor = obj ? obj.codigoTipoFactor : null;
        this.descripcion = obj ? obj.descripcion : null;
        this.edadMinima = obj ? obj.edadMinima : null;
        this.edadMaxima = obj ? obj.edadMaxima : null;
        this.archivo = obj ? obj.archivo : null;
        this.fechaVigencia = obj ? obj.fechaVigencia : null;
        this.fechaHoraCargue = obj ? obj.fechaHoraCargue : null;
        this.totalDatos = obj ? obj.totalDatos : null;
    }
}