import { BeneficiarioMenu } from '../beneficiarios.menu';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiariosRepetidosConfig {
  submenu: SubmenuConfiguracion = BeneficiarioMenu.submenu;

  gridRepetidos: MimGridConfiguracion = new MimGridConfiguracion();
  titulo = '';

  constructor() {
    this.gridRepetidos.selectMode = false;
    this.gridRepetidos.scrollHorizontal = false;
    this.gridRepetidos.datos = [];
    this.gridRepetidos.paginarDatos = true;
    this.gridRepetidos.columnas = [
      {
        key: 'tipoIdentificacionAsociado',
        titulo: 'beneficiarios.repetidos.tipoIdAsociado'
      },
      {
        key: 'identificacionAsociado',
        titulo: 'beneficiarios.repetidos.numeroIdAsociado'
      },
      {
        key: 'nombreAsociado',
        titulo: 'beneficiarios.repetidos.nombreAsociado'
      },
      {
        key: 'regionalAsociado',
        titulo: 'beneficiarios.repetidos.regionalAsociado'
      },
      {
        key: 'tipoIdentificacionBeneficiario',
        titulo: 'beneficiarios.repetidos.tipoIdBeneficiario'
      },
      {
        key: 'identificacionBeneficiario',
        titulo: 'beneficiarios.repetidos.numeroIdBeneficiario'
      },
      {
        key: 'nombreBeneficiario',
        titulo: 'beneficiarios.repetidos.nombreBeneficiario'
      },
      {
        key: 'parentesco',
        titulo: 'beneficiarios.repetidos.parentesco'
      }
    ];
  }
}
