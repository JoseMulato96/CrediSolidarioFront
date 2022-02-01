export class MimSimulaciones {
    mimValoresDevolver: any;
    mimDatosAsociados: any;
    mimValoresDevolverCancelacion: any;
    limpiar: any;
    constructor(objecto: IMimSimulaciones) {
        this.mimValoresDevolver = objecto && objecto.mimValoresDevolver || null;
        this.mimDatosAsociados = objecto && objecto.mimDatosAsociados || null;
        this.mimValoresDevolverCancelacion = objecto && objecto.mimValoresDevolverCancelacion || null;
        this.limpiar = objecto && objecto.limpiar || null;
    }
}

export interface IMimSimulaciones {
    mimValoresDevolver: any;
    mimDatosAsociados: any;
    mimValoresDevolverCancelacion: any;
    limpiar: any;
}
