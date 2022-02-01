export class SipDiagnosticos {
  diagCod: string;

  constructor(objeto: ISipDiagnosticos) {
    this.diagCod = objeto && objeto.diagCod || null;
  }

}

export interface ISipDiagnosticos {
  diagCod: string;
}
