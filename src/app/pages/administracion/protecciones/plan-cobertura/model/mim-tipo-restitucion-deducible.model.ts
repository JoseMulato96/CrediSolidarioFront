export class MimTipoRestitucionDeducible {
    codigo: number;

    constructor(objeto: IMimTipoRestitucionDeducible) {
        this.codigo = objeto && objeto.codigo || null;
    }

}

export interface IMimTipoRestitucionDeducible {
    codigo: number;
}
