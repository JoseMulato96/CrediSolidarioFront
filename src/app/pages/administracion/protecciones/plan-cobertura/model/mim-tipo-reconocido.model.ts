export class MimTipoReconocido {
  codigo: number;

  constructor(objeto: IMimTipoReconocido) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoReconocido {
  codigo: number;
}
