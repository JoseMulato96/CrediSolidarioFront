import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';
import { MimWindModalConfiguracion } from './../../../../shared/components/mim-wind-modal/mim-wind-modal.component';

export class ProcesosAutomaticosConfig {

  gridListar: MimGridConfiguracion = new MimGridConfiguracion();
  gridPlanesAsociados: MimGridConfiguracion = new MimGridConfiguracion();
  modalResumen: MimWindModalConfiguracion = new MimWindModalConfiguracion();

  constructor() {
    this.gridListar.paginarDatos = true;
    this.gridListar.columnas = [
      {
        titulo: 'administracion.procesosAutomaticos.grid.nombreJob',
        key: 'mimProcesoAutomatico.nombre',
        configCelda: {
          width: 80
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.descripcionJob',
        key: 'jobDescription',
        configCelda: {
          width: 120
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.expresionCron',
        key: '_expressionCron',
        configCelda: {
          width: 40
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.triggerState',
        key: '_triggerState',
        configCelda: {
          width: 40
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.startTime',
        key: '_startTime',
        configCelda: {
          width: 50
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.previousFireTime',
        key: '_previousFireTime',
        configCelda: {
          width: 50
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.nextFireTime',
        key: '_nextFireTime',
        configCelda: {
          width: 50
        }
      },
      {
        titulo: 'administracion.procesosAutomaticos.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          titleButton: 'Editar',
          width: 18,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }, funDisabled: this.bloquearBotonNormal
        }
      },
      {
        key: 'iniciar-job',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-media-play text--green1',
          cssButton: 'btn btn--icon bg--green3 mx-auto',
          titleButton: 'Iniciar',
          width: 18,
          combinarCeldas: {
            omitir: true
          }
        }
      }
    ];
  }

  bloquearBotonNormal(item: any) {
    return item.running;
  }

}
