export class MimBeneficiarioAsistenciaPK {
  codigoAsistenciaPlanCoberturaDetalle?: number;
  codigoBeneficiarioServicio?: number;

  constructor(objeto: IMimBeneficiarioAsistenciaPK) {
    this.codigoAsistenciaPlanCoberturaDetalle = objeto && objeto.codigoAsistenciaPlanCoberturaDetalle || null;
    this.codigoBeneficiarioServicio = objeto && objeto.codigoBeneficiarioServicio || null;
  }

}

export interface IMimBeneficiarioAsistenciaPK {
  codigoAsistenciaPlanCoberturaDetalle?: number;
  codigoBeneficiarioServicio?: number;
}
