import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiariosInformacionConfig {
  submenu: SubmenuConfiguracion;

  gridInformacion: MimGridConfiguracion = new MimGridConfiguracion();
  titulo = '';

  constructor() {
    this.gridInformacion.selectMode = false;
    this.gridInformacion.scrollHorizontal = false;

    this.gridInformacion.columnas = [
      {
        key: 'benDesTipIden',
        titulo: 'beneficiarios.informacion.tipoIdBeneficiario'
      },
      {
        key: 'benNumIdentificacion',
        titulo: 'beneficiarios.informacion.noIdBeneficiario',
        configCelda: {
          tipo: 'link',
          width: 180
        },
        isTrim: true
      },
      {
        key: 'benNomCompleto',
        titulo: 'beneficiarios.informacion.nombreBeneficiario',
        isTrim: true
      }
    ];
  }
}
