export class MimTipoFecha {
  codigo: number;

  constructor(objeto: IMimTipoFecha) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoFecha {
  codigo: number;
}
