export class MimUnidadTiempo {
  codigo: number;

  constructor(objeto: IMimUnidadTiempo) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimUnidadTiempo {
  codigo: number;
}
