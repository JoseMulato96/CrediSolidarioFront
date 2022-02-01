export class MimTipoValorRestitucion {
  codigo: number;

  constructor(objeto: IMimTipoValorRestitucion) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoValorRestitucion {
  codigo: number;
}
