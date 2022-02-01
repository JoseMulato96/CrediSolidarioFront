import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListaParametrosGeolocalizacionConfig {

  gridListarDetalleGeolocalizacion: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridListarDetalleGeolocalizacion.scrollHorizontal = true;
    this.gridListarDetalleGeolocalizacion.paginarDatos = true;
    this.gridListarDetalleGeolocalizacion.columnas = [
      {
        titulo: 'administracion.configuracionOperaciones.detalle.grid.tipoCantidadCasos',
        key: 'mimTipoCantidadCasosMov.nombre',
        configCelda: {
            width: 80
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.detalle.grid.valorCantidadCasos',
        key: 'valorCantidadCasos',
        configCelda: {
            width: 80
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.detalle.grid.geolocalizacion',
        key: 'nombreGeolocalizacion',
        configCelda: {
            width: 80
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.detalle.grid.ubicacion',
        key: 'ubicacionDetalle.codNom',
        configCelda: {
            width: 80
        }
      },
      {
        titulo: 'administracion.configuracionOperaciones.detalle.grid.acciones',
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
