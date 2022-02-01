import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ReglasExcepcionesConfig {
    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridConfig.scrollHorizontal = false;
        this.gridConfig.esFiltra = true;
        this.gridConfig.columnas = [
            {
                key: 'codigo',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.codigo',
                configCelda: {
                    width: 20,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'codigoTipoMovimiento.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.tipoSolicitud',
                typeFilter: 'select',
                configCelda: {
                    width: 70,
                    habilitarOrdenamiento: true,
                    codeDropdown: 'tipoSolicitud'
                }
            },
            {
                key: 'codigoCondicion.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.condicion',
                configCelda: {
                    width: 70,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: '_permitirExcepcion',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.permitirExcepcion',
                configCelda: {
                    width: 50,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'codigoRolAprobador.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.rolAprobador',
                configCelda: {
                    width: 70,
                    habilitarOrdenamiento: true
                }
            },
            {
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.reglasExcepciones.grid.acciones',
                key: 'editar',
                configCelda: {
                    tipo: 'button',
                    cssIcon: 'icon-edit-3 text--blue1',
                    cssButton: 'btn btn--icon bg--blue2 mx-auto',
                    width: 30
                }
            }
        ];
    }
}
