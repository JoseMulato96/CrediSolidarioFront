import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarDesmembracionPorAccidenteConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    const _desmembracionAccidente = 'administracion.protecciones.desmembracionAccidente.grid.';
    this.gridConfig.columnas = [
      {
        key: 'mimFondo.nombre',
        titulo: _desmembracionAccidente + 'fondo',
        configCelda: {
          width: 120,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: _desmembracionAccidente + 'codigo',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'descripcion',
        titulo: _desmembracionAccidente + 'descripcion',
        configCelda: {
          width: 200,
          habilitarOrdenamiento: true
        }
      },
      {
        key: '_estado',
        titulo: _desmembracionAccidente + 'vigente',
        configCelda: {
          width: 60,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: _desmembracionAccidente + 'fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 80,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: _desmembracionAccidente + 'acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 50
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
