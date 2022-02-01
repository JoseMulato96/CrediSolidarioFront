export class SipConceptoFacturacion {

    concepto: string;
    descripcion: string;

  constructor(objeto: ISipConceptoFacturacion) {
    this.concepto = objeto && objeto.concepto || null;
    this.descripcion = objeto && objeto.descripcion || null;
  }

}

export interface ISipConceptoFacturacion {
    concepto: string;
    descripcion: string;

}
