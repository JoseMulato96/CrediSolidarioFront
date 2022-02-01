import { MimDetalleUsuarioCabeceraConfig } from '@shared/components/mim-detalle-usuario-cabecera/mim-detalle-usuario-cabecera.component';
import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class BeneficiariosNovendadesHistoricoConfig {
  gridHistorico: MimGridConfiguracion = new MimGridConfiguracion();
  titulo = '';

  dllUsuario: MimDetalleUsuarioCabeceraConfig = new MimDetalleUsuarioCabeceraConfig();

  constructor() {
    this.dllUsuario.keyNombre = 'nomBeneficiario';
    this.dllUsuario.keyApellido1 = 'benApellido1';
    this.dllUsuario.keyApellido2 = 'benApellido2';
    this.dllUsuario.atributos = [
      {
        key: 'benDesCorTipIden',
        titulo: 'beneficiarios.asociados.tipoId'
      },
      {
        key: 'benNumIdentificacion',
        titulo: 'beneficiarios.asociados.noId'
      },
      {
        key: 'benDesInvalido',
        titulo: 'beneficiarios.asociados.invalidez'
      },
      {
        key: 'benEdad',
        titulo: 'beneficiarios.asociados.edad'
      },
      {
        key: '_esAsociado',
        titulo: 'beneficiarios.asociados.esAsociado'
      },
      {
        key: 'benFecNac',
        titulo: 'beneficiarios.asociados.fechaNacimiento'
      }
    ];

    this.gridHistorico.selectMode = false;
    this.gridHistorico.scrollHorizontal = true;

    this.gridHistorico.columnas = [
      {
        key: 'asociado.desTipDoc',
        titulo: 'beneficiarios.asociados.tipoId',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'asociado.nitCli',
        titulo: 'beneficiarios.asociados.noIdentificacion',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'asociado.nomCli',
        titulo: 'beneficiarios.asociados.nombreApellido',
        configCelda: {
          width: 250
        }
      },
      {
        key: 'parenNom',
        titulo: 'beneficiarios.asociados.parentesco',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'benTipDesc',
        titulo: 'beneficiarios.asociados.tipoBeneficiario',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'estTipBenNom',
        titulo: 'beneficiarios.asociados.estadoBeneficiaio',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'benAsoFechaRegis',
        titulo: 'beneficiarios.asociados.fechaIngresoBeneficiario',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'esVinBenNom',
        titulo: 'beneficiarios.asociados.estadoAsociado',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'auxFunNom',
        titulo: 'beneficiarios.asociados.indPagAuxFun',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'fechaActIndAuxFun',
        titulo: 'beneficiarios.asociados.fechaActualizacion',
        configCelda: {
          width: 130
        }
      },
      {
        key: 'fechaPago',
        titulo: 'beneficiarios.asociados.fechaPago',
        configCelda: {
          width: 130
        }
      }
    ];
  }
}
