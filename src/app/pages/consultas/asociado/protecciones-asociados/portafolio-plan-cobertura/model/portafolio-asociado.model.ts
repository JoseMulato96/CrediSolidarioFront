
export class PortafolioAsociadoModel {
    mostrarSubMenuConsultas: boolean;
    mostrarDetalleAsociado: boolean;

    constructor(obj: any) {
        this.mostrarSubMenuConsultas = obj.mostrarSubMenuConsultas || false ;
        this.mostrarDetalleAsociado = obj.mostrarDetalleAsociado || true;
    }
}
