import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ConsultaPagosConfig {

  gridPagos: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridPagos.scrollHorizontal = true;
    this.gridPagos.paginarDatos = true;
    this.gridPagos.columnas = [
      {
        key: 'codRec',
        titulo: 'consultas.consultaPagos.grid.numeroReclamacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'nitBen',
        titulo: 'consultas.consultaPagos.grid.identificacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'nomBen',
        titulo: 'consultas.consultaPagos.grid.nombreBeneficiarioPago',
        configCelda: {
          width: 250
        }
      },
      {
        key: 'codAux',
        titulo: 'consultas.consultaPagos.grid.auxilioPagado',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'fecApl',
        titulo: 'consultas.consultaPagos.grid.fechaPago',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'destino',
        titulo: 'consultas.consultaPagos.grid.destino',
        configCelda: {
          width: 200
        }
      },
      {
        key: 'vlrPag',
        titulo: 'consultas.consultaPagos.grid.valorPagado',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'vlrRte',
        titulo: 'consultas.consultaPagos.grid.valorRetenido',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'vlrMul',
        titulo: 'consultas.consultaPagos.grid.valorDeducido',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'vlrNet',
        titulo: 'consultas.consultaPagos.grid.valorNeto',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'nomRet',
        titulo: 'global.status',
        configCelda: {
          width: 250
        }
      },
      {
        key: 'asociado.regionalAso',
        titulo: 'consultas.consultaPagos.grid.regional',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'asociado.zonaAso',
        titulo: 'consultas.consultaPagos.grid.zonaAsociado',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'observaciones',
        titulo: 'global.observations',
        configCelda: {
          width: 250
        }
      },
      {
        key: 'consec',
        titulo: 'consultas.consultaPagos.grid.numeroLiquidacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'conGir',
        titulo: 'consultas.consultaPagos.grid.consecutivoGiro',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'indice',
        titulo: 'consultas.consultaPagos.grid.numero',
        configCelda: {
          width: 100
        }
      }
    ];
  }
}
