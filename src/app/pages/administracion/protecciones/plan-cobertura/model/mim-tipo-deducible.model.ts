export class MimTipoDeducible {
  codigo: number;

  constructor(objeto: IMimTipoDeducible) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoDeducible {
  codigo: number;
}
