export class MimPresentacionPortafolio {
    codigo: number;
    constructor(objeto: IMimPresentacionPortafolio) {
      this.codigo = objeto && objeto.codigo || null;
    }  
  }
  
export interface IMimPresentacionPortafolio {
    codigo: number;
}
  