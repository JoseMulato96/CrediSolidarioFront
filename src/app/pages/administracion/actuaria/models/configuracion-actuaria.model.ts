
export class ConfiguracionActuariaModel {
    conceptoDistribucion: any; // ConceptosDistribucionModel;
    cargueMasivoFactores: any; // CargueMasivoFactoresModel;
    coberturasCargueMasivo: any;
    factores: any;

    constructor(obj: any) {
        this.conceptoDistribucion = obj ? obj.conceptoDistribucion : null;
        this.cargueMasivoFactores = obj ? obj.cargueMasivoFactores : null;
        this.coberturasCargueMasivo = obj ? obj.categoriasCargueMasivo : null;
        this.factores = obj ? obj.factores : null;
    }
}
