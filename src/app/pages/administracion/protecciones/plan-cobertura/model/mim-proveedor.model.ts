export class MimProveedor {
  codigo: number;
  nombre?: string;
  fechaModificacion?: string;
  estado?: boolean;

  constructor(objeto: IMimProveedor) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombre = objeto && objeto.nombre || null;
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
    this.estado = objeto && objeto.estado || false;
  }

}

export interface IMimProveedor {
  codigo: number;
  nombre?: string;
  fechaModificacion?: string;
  estado?: boolean;
}
