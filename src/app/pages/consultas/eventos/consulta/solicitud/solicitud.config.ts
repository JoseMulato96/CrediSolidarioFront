import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';

export class SolicitudConfig {
    detalleEvento: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();
  constructor() {
    this.detalleEvento.items = [
      {
        label: 'eventos.consulta.detalleDatosEvento.noEvento',
        key: 'codigo'
      },
      {
        label: 'eventos.consulta.detalleDatosEvento.noLiquidacion',
        key: 'nroLiquidacion'
      },
      {
        label: 'eventos.consulta.detalleDatosEvento.fechaEvento',
        key: 'fechaEvento'
      },
      {
        label: 'eventos.consulta.detalleDatosEvento.fechaSolicitud',
        key: 'fechaSolicitud'
      },
      {
        label: 'eventos.consulta.detalleDatosEvento.tipoAuxilio',
        key: 'mimEvento.nombre'
      },
      {
        label: 'eventos.consulta.detalleDatosEvento.estado',
        key: 'mimEstadoSolicitudEvento.nombre'
      }
    ];
    this.detalleEvento.footer = {
      title: 'eventos.consulta.detalleDatosEvento.totalDatos',
      link: []
    };
  }
}
