export class MimPresentacionProtafolio {
    codigo: number;
  
    constructor(objeto: IMimPresentacionProtafolio) {
      this.codigo = objeto && objeto.codigo || null;
    }
  
  }
  
  export interface IMimPresentacionProtafolio {
    codigo: number;
  }
  