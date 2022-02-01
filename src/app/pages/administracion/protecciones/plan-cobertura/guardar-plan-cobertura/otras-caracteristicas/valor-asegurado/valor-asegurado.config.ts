import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class ValorAseguradoConfig {
    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();

    constructor() {
        this.gridConfig.scrollHorizontal = false;
        this.gridConfig.columnas = [
            {
                key: 'codigo',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.codigo',
                configCelda: {
                    width: 60
                }
            },
            {
                key: 'mimTipoValorAsegurado.nombre',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.tipoValorAsegurado',
                configCelda: {
                    width: 150
                }
            },
            {
                key: 'fechaVigenteInicio',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.inicioVigencia',
                configCelda: {
                    width: 130
                }
            },
            {
                key: 'fechaVigenteFin',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.finVigencia',
                configCelda: {
                    width: 120
                }
            },
            {
                key: '_estado',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.vigente',
                configCelda: {
                    width: 70
                }
            },
            {
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.fechaModificacion',
                key: 'fechaModificacion',
                configCelda: {
                    width: 130
                }
            },
            {
                key: 'editar',
                titulo: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.valorAsegurado.grid.acciones',
                configCelda: {
                    tipo: 'button',
                    cssIcon: 'icon-edit-3 text--blue1',
                    cssButton: 'btn btn--icon bg--blue2 mx-auto',
                    width: 40,
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
