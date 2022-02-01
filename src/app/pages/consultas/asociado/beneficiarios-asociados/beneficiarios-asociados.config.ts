import { MimWindModalConfiguracion } from '@shared/components/mim-wind-modal/mim-wind-modal.component';

import { DistribucionPorcentajeConfiguracion } from './nuevo-beneficiario/distribucion-porcentaje/distribucion-porcentaje.component';

export class BeneficiariosAsociadosConfig {
  winPorcentaje: MimWindModalConfiguracion = new MimWindModalConfiguracion();
  beneficiariosPorcejate: DistribucionPorcentajeConfiguracion = new DistribucionPorcentajeConfiguracion();
  constructor() {
    this.winPorcentaje.width = '750px';

    this.winPorcentaje.iconCss = 'danger icon-alert-triangle';

    this.winPorcentaje.titulo =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.titulo';
    this.beneficiariosPorcejate.keyPorcentaje = 'benPorcentaje';
    this.beneficiariosPorcejate.keyTitulo = 'nomBeneficiario';
    this.beneficiariosPorcejate.titulo =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.nombre';
    this.beneficiariosPorcejate.tituloPorcentaje = 'porcentaje';
    this.beneficiariosPorcejate.tituloBorrar =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.borrar';
    this.beneficiariosPorcejate.labelAutomatico =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.btnAutomatico';
    this.beneficiariosPorcejate.labelManual =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.btnManul';
    this.beneficiariosPorcejate.labelAceptar =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.btnAceptar';
    this.beneficiariosPorcejate.labelDistribucion =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.distribuir';
  }
}
