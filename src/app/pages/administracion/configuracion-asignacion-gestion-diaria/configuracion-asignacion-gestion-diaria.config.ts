import { MimGridConfiguracion } from './../../../shared/components/mim-grid/mim-grid-configuracion';

export class ConfiguracionAsignacionGestionsDiariaConfig {
    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridConfig.scrollHorizontal = true;
        this.gridConfig.columnas = [
            {
                key: 'proceso',
                titulo: 'administracion.configuracionAsignacionGestionDiaria.grid.proceso',
                configCelda: {
                    width: 180
                }
            }, {
                key: 'mimTipoAsignacionDto.nombre',
                titulo: 'administracion.configuracionAsignacionGestionDiaria.grid.tipoAsignacion',
                configCelda: {
                    width: 180
                }
            }, {
                titulo: 'administracion.configuracionAsignacionGestionDiaria.grid.acciones',
                key: 'editar',
                configCelda: {
                    tipo: 'button',
                    cssIcon: 'icon-edit-3 text--blue1',
                    cssButton: 'btn btn--icon bg--blue2 mx-auto',
                    width: 35,
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
                    width: 35,
                    combinarCeldas: {
                        omitir: true
                    }
                }
            }
        ];
    }

}
