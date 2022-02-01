export class MimTransaccionExclusion {
  codigo: number;
  nombre: string;
  estado: boolean;

  constructor(objeto: IMimTransaccionExclusion) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombre = objeto && objeto.nombre || null;
    this.estado = objeto && objeto.estado || false;
  }

}

export interface IMimTransaccionExclusion {
  codigo: number;
  nombre: string;
  estado: boolean;
}
