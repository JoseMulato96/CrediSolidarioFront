import { MimBeneficiarioAsistencia, IMimBeneficiarioAsistencia } from './mim-beneficiario-asistencia.model';
import { MimProveedor, IMimProveedor } from './mim-proveedor.model';

export class MimAsistenciaPlanCoberturaDetalle {
  codigo: number;
  mimProveedor: MimProveedor;
  fechaModificacion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: boolean;
  mimBeneficiarioAsistenciaList?: MimBeneficiarioAsistencia[];

  constructor(objeto: IMimAsistenciaPlanCoberturaDetalle) {
    this.codigo = objeto && objeto.codigo || null;
    this.mimProveedor = objeto && objeto.mimProveedor || null;
    this.fechaModificacion = objeto && objeto.fechaModificacion || null;
    this.fechaInicio = objeto && objeto.fechaInicio || null;
    this.fechaFin = objeto && objeto.fechaFin || null;
    this.estado = objeto && objeto.estado || false;
    this.mimBeneficiarioAsistenciaList = objeto && objeto.mimBeneficiarioAsistenciaList || null;
  }

}

export interface IMimAsistenciaPlanCoberturaDetalle {
  codigo: number;
  mimProveedor: IMimProveedor;
  fechaModificacion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: boolean;
  mimBeneficiarioAsistenciaList?: IMimBeneficiarioAsistencia[];
}
