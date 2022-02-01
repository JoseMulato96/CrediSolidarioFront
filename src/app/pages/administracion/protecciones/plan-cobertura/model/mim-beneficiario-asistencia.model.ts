import { MimBeneficiarioAsistenciaPK, IMimBeneficiarioAsistenciaPK } from './mim-beneficiario-asistencia-pk.model';
import { MimTipoBeneficiarioServicio, IMimTipoBeneficiarioServicio } from './mim-tipo-beneficiario-servicio.model';

export class MimBeneficiarioAsistencia {
  mimBeneficiarioAsistenciaPK?: MimBeneficiarioAsistenciaPK;
  mimTipoBeneficiarioServicio?: MimTipoBeneficiarioServicio;

  constructor(objeto: IMimBeneficiarioAsistencia) {
    this.mimBeneficiarioAsistenciaPK = objeto && objeto.mimBeneficiarioAsistenciaPK || null;
    this.mimTipoBeneficiarioServicio = objeto && objeto.mimTipoBeneficiarioServicio || null;
  }

}

export interface IMimBeneficiarioAsistencia {
  mimBeneficiarioAsistenciaPK?: IMimBeneficiarioAsistenciaPK;
  mimTipoBeneficiarioServicio?: IMimTipoBeneficiarioServicio;
}
