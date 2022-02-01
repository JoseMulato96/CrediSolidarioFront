import { MimGridConfiguracion } from './../../../../shared/components/mim-grid/mim-grid-configuracion';

export class LogNovedadesConfig {
    gridLogNovedades: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridLogNovedades.selectMode = false;
        this.gridLogNovedades.scrollHorizontal = true;
        this.gridLogNovedades.pagina = 0;
        this.gridLogNovedades.datos = [];
        this.gridLogNovedades.columnas = [
          {
            key: 'columnaTabla',
            titulo: 'administracion.configuracion-seguridad.log-novedades.grid.campoTabla',
            configCelda: { width: 100, cssKey: '' }
          },
          {
            key: 'codigoDescripcionNovedad.descripcionNovedad',
            titulo: 'administracion.configuracion-seguridad.log-novedades.grid.novedad',
            configCelda: { width: 100, cssKey: '' }
          },
          {
            key: 'codigo',
            titulo: 'administracion.configuracion-seguridad.log-novedades.grid.eliminar',
            configCelda: {
              tipo: 'icon',
              cssIcon: 'icon-trash-3 text--red1',
              width: 130
            }
          }

        ];
      }
}
