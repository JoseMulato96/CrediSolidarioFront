export class MimCausa {
  codigo: number;

  constructor(objeto: IMimCausa) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimCausa {
  codigo: number;
}
