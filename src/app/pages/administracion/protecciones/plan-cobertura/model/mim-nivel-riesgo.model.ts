export class MimNivelRiesgo {
  codigo: number;

  constructor(objeto: IMimNivelRiesgo) {
    this.codigo = objeto && objeto.codigo || null;
  }

}

export interface IMimNivelRiesgo {
  codigo: number;
}
