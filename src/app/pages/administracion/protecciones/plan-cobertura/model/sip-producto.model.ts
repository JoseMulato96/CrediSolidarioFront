export class SipProducto {
    codigo: number;

    constructor(objeto: ISipProducto) {
      this.codigo = objeto && objeto.codigo || null;
    }

  }

  export interface ISipProducto {
    codigo: number;
  }

