import { MimGridConfiguracion } from './../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarEnfermedadesGravesConfig {
  gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridConfig.scrollHorizontal = true;
    this.gridConfig.ordenamientoPersonalizado = true;
    this.gridConfig.esFiltra = true;
    this.gridConfig.columnas = [
      {
        key: 'mimFondo.nombre',
        titulo: 'administracion.protecciones.enfermedadesGraves.grid.fondo',
        keyFiltro: 'nombreFondo',
        typeFilter: 'textBack',
        configCelda: {
          width: 170,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'codigo',
        titulo: 'administracion.protecciones.enfermedadesGraves.grid.codigo',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'descripcion',
        titulo: 'administracion.protecciones.enfermedadesGraves.grid.descripcion',
        keyFiltro: 'descripcionEnfermedadGrave',
        typeFilter: 'textBack',
        configCelda: {
          width: 155,
          habilitarOrdenamiento: true
        }
      },

      {
        key: '_estado',
        titulo: 'administracion.protecciones.enfermedadesGraves.grid.vigente',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true,
          sortKey: 'estado'
        }
      },
      {
        titulo: 'administracion.protecciones.enfermedadesGraves.grid.fechaModificacion',
        key: 'fechaModificacion',
        configCelda: {
          width: 70,
          habilitarOrdenamiento: true
        }
      },
      {
        key: 'editar',
        titulo: 'administracion.protecciones.exclusiones.grid.acciones',
        configCelda: {
          tipo: 'button',
          cssIcon: 'icon-edit-3 text--blue1',
          cssButton: 'btn btn--icon bg--blue2 mx-auto',
          width: 70
        }
      }
    ];
  }

  bloquearBoton(item: any) {
    return !item.estado;
  }
}
