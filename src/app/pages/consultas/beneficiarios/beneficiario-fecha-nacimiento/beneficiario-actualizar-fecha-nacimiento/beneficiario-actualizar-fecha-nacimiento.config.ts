import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiariosActualizarFechaNacimientoConfig {
  submenu: SubmenuConfiguracion;
  gridRelacionado: MimGridConfiguracion = new MimGridConfiguracion();
  titulo = '';


  constructor() {
    this.gridRelacionado.selectMode = false;
    this.gridRelacionado.scrollHorizontal = true;

    this.gridRelacionado.columnas = [
      {
        key: 'asociado.nitCli',
        titulo: 'beneficiarios.asociados.noIdentificacion',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'asociado.nomCli',
        titulo: 'beneficiarios.asociados.nombreAsociado',
        configCelda: {
          width: 250
        }
      },
      {
        key: 'nombreParentesco',
        titulo: 'beneficiarios.asociados.parentesco',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'nombreTipoBeneficiario',
        titulo: 'beneficiarios.asociados.tipoBeneficiario',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'cobertura',
        titulo: 'beneficiarios.asociados.cobertura',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'valorCuota',
        titulo: 'beneficiarios.asociados.valorCuota',
        configCelda: {
          width: 130,
          tipo: 'currency'
        }
      },
      {
        key: 'nuevoValorCuota',
        titulo: 'beneficiarios.asociados.nvoVlrCuota',
        configCelda: {
          width: 130,
          tipo: 'currency'
        }
      },
      {
        key: 'observaciones',
        titulo: 'beneficiarios.asociados.observaciones',
        configCelda: {
          width: 130
        }
      }
    ];
  }
}
