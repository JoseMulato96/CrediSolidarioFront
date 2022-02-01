export class MimTipoPeriodicidad {

    codigo: number;

  constructor(objeto: IMimTipoPeriodicidad) {
    this.codigo = objeto && objeto.codigo || null;
  }
}

export interface IMimTipoPeriodicidad {
  codigo: number;
}
