export class MimCondicionCobertura {
  codigo: number;

  constructor(objeto: IMimCondicionCobertura) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimCondicionCobertura {
  codigo: number;
}
