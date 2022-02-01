export class MimPlan {
  codigo: number;
  nombre: string;
  mimFondo: any;

  constructor(objeto: IMimPlan) {
    this.codigo = objeto && objeto.codigo || null;
    this.nombre = objeto && objeto.nombre || null;
    this.mimFondo = objeto && objeto.mimFondo || null;
  }

}

export interface IMimPlan {
  codigo: number;
  nombre: string;
  mimFondo: any;
}
