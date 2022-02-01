import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarParametrosConfiguracionConfig {

  gridListarConfiguracionOperacion: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarConfiguracionOperacion.scrollHorizontal = true;
    this.gridListarConfiguracionOperacion.ordenamientoPersonalizado = true;
    this.gridListarConfiguracionOperacion.columnas = [
      {
          titulo: 'administracion.configuracionOperaciones.grid.tipoConfiguracion',
          key: '_tipoConfiguracion',
          configCelda: {
              width: 80
          }
      },
      {
        titulo: 'administracion.configuracionOperaciones.grid.plan',
        key: 'mimPlan.nombre',
        configCelda: {
            width: 120
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.grid.cobertura',
        key: 'mimCobertura.nombre',
        configCelda: {
            width: 100
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.grid.tipoSolicitud',
        key: 'mimTipoMovimiento.nombre',
        configCelda: {
            width: 80
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.grid.fechaCreacion',
        key: 'fechaCreacion',
        configCelda: {
            width: 90
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 20,
          combinarCeldas: {
            omitir: false,
            numeroCombinar: 2
          }
        }
      },
      {
        key: 'eliminar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-trash-3 text--red1',
          cssButton: 'btn btn--icon bg--red2 mx-auto',
          width: 20,
          combinarCeldas: {
            omitir: true
          }
        }
      }
    ];
  }
}
