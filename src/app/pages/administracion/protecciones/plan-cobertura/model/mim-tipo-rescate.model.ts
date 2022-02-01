export class MimTipoRescate {
  codigo: number;

  constructor(objeto: IMimTipoRescate) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoRescate {
  codigo: number;
}
