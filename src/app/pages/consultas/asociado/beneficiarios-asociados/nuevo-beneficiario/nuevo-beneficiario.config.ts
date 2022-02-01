import { MimWindModalConfiguracion } from '@shared/components/mim-wind-modal/mim-wind-modal.component';
import { BeneficiariosExistentesConfiguracion } from './beneficiarios-existentes/beneficiarios-existentes.component';
import { DistribucionPorcentajeConfiguracion } from './distribucion-porcentaje/distribucion-porcentaje.component';

export class NuevoBeneficiarioConfig {
  _autocompleteTipoSolicitudes: any[] = [];
  tipoSolicitudes: any[] = [];
  tiposBeneficiarios: any[] = [];
  tipoIdentificaciones: any[] = [];
  tiposParentescos: any[] = [];
  tiposCanalVenta: any[] = [];
  tipoPromotor: any[] = [];
  planEducativo: any[] = [];

  winPorcentaje: MimWindModalConfiguracion = new MimWindModalConfiguracion();
  winNormal: MimWindModalConfiguracion = new MimWindModalConfiguracion();

  beneficiariosExistentes: BeneficiariosExistentesConfiguracion = new BeneficiariosExistentesConfiguracion();
  beneficiariosPorcejate: DistribucionPorcentajeConfiguracion = new DistribucionPorcentajeConfiguracion();

  constructor() {
    this.winPorcentaje.width = '750px';
    this.winNormal.width = '750px';

    this.winPorcentaje.iconCss = 'danger icon-alert-triangle';
    this.winNormal.iconCss = 'danger icon-alert-triangle';

    this.winNormal.titulo =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.titulo';

    this.winPorcentaje.titulo =
      'asociado.beneficiario.nuevoBeneficiario.winModalPorcentaje.titulo';

    this.beneficiariosExistentes.columnas = [
      {
        key: 'nomCli',
        titulo:
          'asociado.beneficiario.nuevoBeneficiario.winModalExistente.nombre'
      },
      {
        key: 'nitCli',
        titulo:
          'asociado.beneficiario.nuevoBeneficiario.winModalExistente.identificacion'
      },
      {
        key: 'estadoBeneficiario',
        titulo: 'asociado.beneficiario.nuevoBeneficiario.winModalExistente.estado'
      }
    ];

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

    this.beneficiariosExistentes.titleNombre =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.nombre';
    this.beneficiariosExistentes.titleAsociado =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.asociado';
    this.beneficiariosExistentes.titleBtnAceptar =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.btnAceptar';
    this.beneficiariosExistentes.titleEstado =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.estado';
    this.beneficiariosExistentes.titleIdentificacion =
      'asociado.beneficiario.nuevoBeneficiario.winModalExistente.identificacion';
  }
}
