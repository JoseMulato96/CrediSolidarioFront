export class MimTipoValorTope {
  codigo: number;

  constructor(objeto: IMimTipoValorTope) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoValorTope {
  codigo: number;
}
