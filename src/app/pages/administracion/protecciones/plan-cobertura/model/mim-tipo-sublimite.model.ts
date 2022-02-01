export class MimTipoSublimite {

    codigo: number;

  constructor(objeto: IMimTipoSublimite) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoSublimite {
  codigo: number;
}
