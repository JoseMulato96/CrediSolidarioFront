export class MimTipoPlan {
  codigo: number;

  constructor(objeto: IMimTipoPlan) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoPlan {
  codigo: number;
}
