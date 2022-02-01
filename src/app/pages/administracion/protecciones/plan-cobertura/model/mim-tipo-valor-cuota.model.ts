export class MimTipoValorCuota {

    codigo: number;

  constructor(objeto: IMimTipoValorCuota) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoValorCuota {
  codigo: number;
}
