export class MimTipoValorDevolver {

    codigo: number;

  constructor(objeto: IMimTipoValorDevolver) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoValorDevolver {
  codigo: number;
}
