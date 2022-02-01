export class MimTipoValorAsegurado {
  codigo: number;

  constructor(objeto: IMimTipoValorAsegurado) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoValorAsegurado {
  codigo: number;
}
