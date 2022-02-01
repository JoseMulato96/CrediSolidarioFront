export class MimCanalVentaExclusion {
  codigo: number;
  nombre: string;
  estado: boolean;

  constructor(objeto: IMimCanalVentaExclusion) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombre = objeto && objeto.nombre || null;
    this.estado = objeto && objeto.estado || null;
  }

}

export interface IMimCanalVentaExclusion {
  codigo: number;
  nombre: string;
  estado: boolean;
}
