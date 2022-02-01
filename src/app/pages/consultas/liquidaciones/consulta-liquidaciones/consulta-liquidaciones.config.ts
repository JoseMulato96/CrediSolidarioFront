import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';

export class ConsultaLiquidacionesConfig {

  gridLiquidacion: MimGridConfiguracion = new MimGridConfiguracion();

  barFilter: MimFiltroVerticalComponentConfig = {};

  constructor() {
    this.gridLiquidacion.scrollHorizontal = false;
    this.gridLiquidacion.paginarDatos = true;
    this.gridLiquidacion.mostrarPaginador = true;
    this.gridLiquidacion.columnas = [
      {
        key: 'codRec',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.noReclamacion',
        configCelda: {
          width: 120
        }
      },
      {
        key: 'consec',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.noLiquidacion',
        configCelda: {
          width: 120,
          tipo: 'link'
        }
      },
      {
        key: '_asociado',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.asociado',
        configCelda: {
          width: 280
        }
      },
      {
        key: 'fecApl',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.fechaPago',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'nomEstPago',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.estado',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'nomFormaPago',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.formaPago',
        configCelda: {
          width: 90
        }
      },
      {
        key: 'nomTipAux',
        titulo: 'liquidaciones.consultaLiquidaciones.grid.auxilioReclamado',
        configCelda: {
          width: 140
        }
      }
    ];
  }
}
