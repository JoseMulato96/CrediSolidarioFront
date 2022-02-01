export class MimBeneficiarioPagoValorRescate {
    codigo: number;
    constructor(objeto: IMimBeneficiarioPagoValorRescate) {
      this.codigo = objeto && objeto.codigo || null;
    }  
  }
  
export interface IMimBeneficiarioPagoValorRescate {
    codigo: number;
}
