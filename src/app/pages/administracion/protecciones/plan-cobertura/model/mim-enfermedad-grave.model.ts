export class MimEnfermedadGrave {
  codigo: number;
  constructor(objeto: IMimEnfermedadGrave) {
    this.codigo = objeto && objeto.codigo || null;
  }
}

export interface IMimEnfermedadGrave {
  codigo: number;
}
