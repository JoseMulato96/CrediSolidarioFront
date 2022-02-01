export class ConfiguracionFinancieraModel {
    maestroCuentas: any;
    maestroUsoLocal: any;
    relacionConceptosDeDistribucionCuenta: any;

    constructor(obj: any) {
        this.maestroCuentas = obj ? obj.maestroCuentas : null ;
        this.maestroUsoLocal = obj ? obj.maestroUsoLocal : null ;
        this.relacionConceptosDeDistribucionCuenta = obj ? obj.relacionConceptosDeDistribucionCuenta : null ;
    }
}
