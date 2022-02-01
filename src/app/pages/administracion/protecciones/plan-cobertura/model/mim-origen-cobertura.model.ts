export class MimOrigenCobertura {
  codigo: number;

  constructor(objeto: IMimOrigenCobertura) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimOrigenCobertura {
  codigo: number;
}
