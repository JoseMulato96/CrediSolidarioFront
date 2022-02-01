export class MimCausaIndemnizacion {
  codigo: number;

  constructor(objeto: IMimCausaIndemnizacion) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimCausaIndemnizacion {
  codigo: number;
}
