export interface IRegistraSolicitud {
    asoNumInt?: string;
    procesoId?: string;
    tareaId?: string;
    solicitudRecibidaPor?: any;
    canal?: any;
    tipoEvento?: any;
    codigoBeneficiarioAsociado?: number;
    reclamoPor?: any;
    fechaReclamacion?: string;
    origen?: any;
    tratamientoEspecial?: boolean;
    declarante?: boolean;
    aviso?: boolean;
    documentos?: any;
    datosAsociado?: any;
    solicitudEvento?: any;
    oficinaRegistro?: string;
}

export class RegistraSolicitud implements IRegistraSolicitud {
  constructor(
    public asoNumInt?: string,
    public procesoId?: string,
    public tareaId?: string,
    public solicitudRecibidaPor?: any,
    public canal?: any,
    public tipoEvento?: any,
    public codigoBeneficiarioAsociado?: number,
    public reclamoPor?: any,
    public fechaReclamacion?: string,
    public origen?: any,
    public tratamientoEspecial?: boolean,
    public declarante?: boolean,
    public aviso?: boolean,
    public documentos?: any,
    public datosAsociado?: any,
    public solicitudEvento?: any,
    public oficinaRegistro?: string
  ) {}
}
