import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

import { BeneficiarioMenu } from '../beneficiarios.menu';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiariosFallecidosConfig {
  submenu: SubmenuConfiguracion = BeneficiarioMenu.submenu;

  gridFallecidos: MimGridConfiguracion = new MimGridConfiguracion();
  titulo = '';

  constructor() {
    this.gridFallecidos.selectMode = false;
    this.gridFallecidos.scrollHorizontal = false;
    this.gridFallecidos.datos = [];
    this.gridFallecidos.paginarDatos = true;
    this.gridFallecidos.columnas = [
      {
        key: 'tipoIdentificacionAsociado',
        titulo: 'beneficiarios.fallecidos.tipoIdAsociado',
        isTrim: true
      },
      { key: 'identificacionAsociado', titulo: 'beneficiarios.fallecidos.numeroIdAsociado' },
      {
        key: 'nombreAsociado',
        titulo: 'beneficiarios.fallecidos.nombreAsociado',
        isTrim: true
      },
      {
        key: 'regionalAsociado',
        titulo: 'beneficiarios.fallecidos.regionalAsociado',
        isTrim: true
      },
      {
        key: 'tipoBeneficiario',
        titulo: 'beneficiarios.fallecidos.tipoBeneficiario',
        isTrim: true
      },
      {
        key: 'tipoIdentificacionBeneficiario',
        titulo: 'beneficiarios.fallecidos.tipoIdBeneficiario',
        isTrim: true
      },
      { key: 'identificacionBeneficiario', titulo: 'beneficiarios.fallecidos.numeroIdBeneficiario' },
      {
        key: 'nombreBeneficiario',
        titulo: 'beneficiarios.fallecidos.nombreBeneficiario',
        isTrim: true
      }
    ];
  }
}
