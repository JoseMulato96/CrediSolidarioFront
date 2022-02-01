export class MimTipoConcepto {
    codigo: number;
    nombre: string;

    constructor(objeto: IMimTipoConcepto) {
      this.codigo = objeto && objeto.codigo || null;
      this.nombre = objeto && objeto.nombre || null;

    }

  }

  export interface IMimTipoConcepto {
    codigo: number;
    nombre: string;
  }

