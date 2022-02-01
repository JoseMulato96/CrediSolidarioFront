import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ConsultaAsociadosConfig {
  gridConsulta: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConsulta.columnas = [
      {
        key: '_nombreTipo',
        titulo: 'asociado.tipo',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'desTipDoc',
        titulo: 'asociado.tipoDocumento',
        fun: function (valor: string) {
          return valor
            .trim()
            .split(' ')
            .reverse()[0];
        },
        configCelda: {
          width: 70
        }
      },
      {
        key: 'nitCli',
        titulo: 'asociado.identificacion',
        configCelda: { tipo: 'link', width: 155 }
      },
      { key: 'nomCli', titulo: 'asociado.nombre' },
      {
        key: 'fecNac',
        titulo: 'asociado.edad',
        configCelda: {
          tipo: 'birthday',
          width: 70
        }
      },
      {
        key: 'fecNac',
        titulo: 'asociado.fechaNacimiento',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'fecIngreso',
        titulo: 'asociado.fechaIngreso',
        configCelda: {
          width: 140
        }
      },
      {
        key: 'tipoVin',
        titulo: 'asociado.tipoVinculacion',
        configCelda: {
          width: 120
        }
      },
      {
        key: 'cliente',
        titulo: 'asociado.cliente',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'desEstado',
        titulo: 'asociado.estado',
        configCelda: {
          width: 170
        }
      }
    ];
  }
}
