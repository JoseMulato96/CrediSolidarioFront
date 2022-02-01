export class MimTipoSubsistencia {
  codigo: number;

  constructor(objeto: IMimTipoSubsistencia) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimTipoSubsistencia {
  codigo: number;
}
