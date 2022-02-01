export class MimTipoValorProteccion {

    codigo: number;

  constructor(objeto: IMimTipoValorProteccion) {
    this.codigo = objeto && objeto.codigo || null;
  }
}

export interface IMimTipoValorProteccion {
    codigo: number;
}
