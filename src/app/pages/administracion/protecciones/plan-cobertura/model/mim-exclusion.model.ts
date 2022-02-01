export class MimExclusion {
  codigo: number;
  nombre: string;
  fechaModificacion: string;
  estado: boolean;

  constructor(objeto: IMimExclusion) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombre = objeto && objeto.nombre || null;
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
    this.estado = objeto && objeto.estado || false;
  }

}

export interface IMimExclusion {
  codigo: number;
  nombre: string;
  fechaModificacion: string;
  estado: boolean;
}
