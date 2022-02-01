import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
export class RentasConfig {

  gridRentas: MimGridConfiguracion = new MimGridConfiguracion();
  personaRentas: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();

  constructor() {
    this.gridRentas.paginarDatos = true;
    this.gridRentas.columnas = [
      {
        key: 'numeroRenta',
        titulo: 'eventos.consulta.rentas.renta',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'renValor',
        titulo: 'eventos.consulta.rentas.valor',
        configCelda: {
          width: 100,
          tipo: 'currency'
        }
      },
      {
        key: 'liqConsecutivo',
        titulo: 'eventos.consulta.rentas.noLiquidacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: '_renEstado',
        titulo: 'eventos.consulta.rentas.pagadaEnAnteriorLiquidacion',
        configCelda: {
          width: 100
        }
      },
      {
        key: 'renFechaPago',
        titulo: 'eventos.consulta.rentas.fechaPago',
        configCelda: {
          width: 150
        }
      }
    ];
  }
}
