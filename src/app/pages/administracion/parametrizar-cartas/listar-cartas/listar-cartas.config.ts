import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarCartasConfig {

  gridListarCartas: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarCartas.scrollHorizontal = true;
    this.gridListarCartas.ordenamientoPersonalizado = true;
    this.gridListarCartas.columnas = [
      {
        titulo: 'administracion.parametrizarCartas.grid.codigoCarta',
        key: 'codigo',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.parametrizarCartas.grid.nombreCarta',
        key: 'nombre',
        configCelda: {
          width: 150,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: 'administracion.parametrizarCartas.grid.estado',
        configCelda: {
          sortKey: 'estado',
          width: 90,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.parametrizarCartas.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 125,
          habilitarOrdenamiento: true
        }
      },
      {
        titulo: 'administracion.parametrizarCartas.grid.acciones',
        key: 'editar',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 60,
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
          width: 60,
          combinarCeldas: {
            omitir: true
          },
          funDisabled: this.bloquearBoton
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }

}
