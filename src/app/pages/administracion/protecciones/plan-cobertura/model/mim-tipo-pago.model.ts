export class MimTipoPago {
  codigo: number;

  constructor(objeto: IMimTipoPago) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoPago {
  codigo: number;
}
