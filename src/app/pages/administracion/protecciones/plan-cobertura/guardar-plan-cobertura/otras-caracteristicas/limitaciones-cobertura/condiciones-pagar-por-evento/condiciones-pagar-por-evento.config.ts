import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class CondicionesPagarEventoConfig {
    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridConfig.scrollHorizontal = false;
        this.gridConfig.columnas = [
            {
                key: 'mimCausa.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.causa',
                configCelda: {
                    width: 80
                }
            },
            {
                key: 'mimUnidad.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.unidad',
                configCelda: {
                    width: 100
                }
            },
            {
                key: 'valor',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.valor',
                configCelda: {
                    width: 90,
                    tipo: 'numero'
                }
            },
            {
                key: 'fechaInicio',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.fechaInicio',
                configCelda: {
                    width: 90
                }
            },
            {
                key: 'fechaFin',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.fechaFin',
                configCelda: {
                    width: 90
                }
            },
            {
                key: '_estado',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.vigente',
                configCelda: {
                    width: 80
                }
            },
            {
                key: 'fechaModificacion',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.fechaModificacion',
                configCelda: {
                    width: 100
                }
            },           
            {
                key: 'editar',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.acciones',
                configCelda: {
                    tipo: 'button',
                    cssIcon: 'icon-edit-3 text--blue1',
                    cssButton: 'btn btn--icon bg--blue2 mx-auto',
                    width: 50,
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
                    width: 50,
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
