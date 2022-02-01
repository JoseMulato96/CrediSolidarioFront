import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class SublimiteOtraCoberturaConfig {
    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridConfig.scrollHorizontal = false;
        this.gridConfig.columnas = [
            {
                key: 'mimTipoSublimites.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.tipoSublimite',
                configCelda: {
                    width: 100
                }
            },
            {
                key: 'valor',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.valor',
                configCelda: {
                    width: 90,
                    tipo: 'numero'
                }
            },
            {
                key: 'fechaInicio',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.fechaActualAplica',
                configCelda: {
                    width: 100
                }
            },
            {
                key: '_estado',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.vigente',
                configCelda: {
                    width: 60
                }
            },
            {
                key: 'fechaModificacion',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.fechaModificacion',
                configCelda: {
                    width: 100
                }
            },
            {
                key: 'editar',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.acciones',
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
