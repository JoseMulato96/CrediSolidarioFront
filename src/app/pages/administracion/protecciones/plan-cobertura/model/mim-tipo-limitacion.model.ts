export class MimTipoLimitacion {
  codigo: number;

  constructor(objeto: IMimTipoLimitacion) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoLimitacion {
  codigo: number;
}
