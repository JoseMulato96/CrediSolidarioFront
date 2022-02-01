export class MimCobertura {
  codigo: number;
  asistencia: boolean;
  nombre: string;

  constructor(objeto: IMimCobertura) {
    this.codigo = objeto && objeto.codigo || null;
    this.asistencia = objeto && objeto.asistencia || false;
    this.nombre = objeto && objeto.nombre || null;
  }

}

export interface IMimCobertura {
  codigo: number;
  asistencia: boolean;
  nombre: string;
}
