import { MimGridConfiguracion } from './../../../../../../shared/components/mim-grid/mim-grid-configuracion';

export class ListarcontrolCumulosConfig {

    gridConfig: MimGridConfiguracion = new MimGridConfiguracion();
    gridModal: MimGridConfiguracion = new MimGridConfiguracion();
    constructor() {
        this.gridConfig.scrollHorizontal = true;
        this.gridConfig.ordenamientoPersonalizado = true;
        this.gridConfig.esFiltra = true;
        this.gridConfig.columnas = [
            {
                key: 'codigo',
                titulo: 'administracion.protecciones.controlCumulo.grid.codigo',
                configCelda: {
                    width: 88,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'mimFondo.nombre',
                titulo: 'administracion.protecciones.controlCumulo.grid.fondo',
                keyFiltro: 'nombreFondo',
                typeFilter: 'textBack',
                configCelda: {
                    width: 150,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'mimTipoTope.nombre',
                titulo: 'administracion.protecciones.controlCumulo.grid.tipoTope',
                keyFiltro: 'nombreTipoTope',
                typeFilter: 'textBack',
                configCelda: {
                    width: 150,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'mimCumulo.nombre',
                titulo: 'administracion.protecciones.controlCumulo.grid.nombre',
                keyFiltro: 'nombreCumulo',
                typeFilter: 'textBack',
                configCelda: {
                    width: 190,
                    habilitarOrdenamiento: true
                }
            },
            {
              key: 'fechaInicioVigencia',
              titulo: 'administracion.protecciones.controlCumulo.grid.fechaInicioVigencia',
              keyFiltro: 'fechaInicioVigenciaInicio,fechaInicioVigenciaFin',
              typeFilter: 'date',
              configCelda: {
                  width: 170,
                  habilitarOrdenamiento: true
              }
            },
            {
                key: 'fechaFinVigencia',
                titulo: 'administracion.protecciones.controlCumulo.grid.fechaFinVigencia',
                keyFiltro: 'fechaFinVigenciaInicio,fechaFinVigenciaFin',
                typeFilter: 'date',
                configCelda: {
                    width: 170,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'sipCategoriaAsociado.nombre',
                titulo: 'administracion.protecciones.controlCumulo.grid.categoriaAsociado',
                keyFiltro: 'nombreCategoriaAsociado',
                typeFilter: 'textBack',
                configCelda: {
                    width: 150,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'edadMinimaIngreso',
                titulo: 'administracion.protecciones.controlCumulo.grid.edadMinimaAsociado',
                configCelda: {
                    width: 108,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'edadMaximaIngreso',
                titulo: 'administracion.protecciones.controlCumulo.grid.edadMaximaAsociado',
                configCelda: {
                    width: 108,
                    habilitarOrdenamiento: true
                }
            },
            {
              key: 'ingresoMinimoAsociado',
              titulo: 'administracion.protecciones.controlCumulo.grid.ingresosMinimosAsociado',
              configCelda: {
                  width: 200,
                  habilitarOrdenamiento: true,
                  cssKey: '', tipo: 'currency2'
              }
            },
            {
                key: 'ingresoMaximoAsociado',
                titulo: 'administracion.protecciones.controlCumulo.grid.ingresosMaximosAsociado',
                configCelda: {
                    width: 200,
                    habilitarOrdenamiento: true,
                    cssKey: '', tipo: 'currency2'
                }
            },
            {
              key: 'mimNivelRiesgo.nombre',
              titulo: 'administracion.protecciones.controlCumulo.grid.nivelRiesgo',
              keyFiltro: 'nombreNivelRiesgo',
              typeFilter: 'textBack',
              configCelda: {
                  width: 110,
                  habilitarOrdenamiento: true
              }
            },
            {
                key: 'mimTipoReconocido.nombre',
                titulo: 'administracion.protecciones.controlCumulo.grid.unidad',
                configCelda: {
                    width: 88,
                    habilitarOrdenamiento: true
                }
            },
            {
                key: 'minimoProteccion',
                titulo: 'administracion.protecciones.controlCumulo.grid.valorMinimoTope',
                configCelda: {
                    width: 200,
                    habilitarOrdenamiento: true,
                    cssKey: '',
                }
            },
            {
                key: 'maximoProteccion',
                titulo: 'administracion.protecciones.controlCumulo.grid.valorMaximoTope',
                configCelda: {
                    width: 200,
                    habilitarOrdenamiento: true,
                    cssKey: '',
                }
            },
            {
                key: '_estado',
                titulo: 'administracion.protecciones.controlCumulo.grid.vigente',
                configCelda: {
                    width: 80
                }
            },
            {
                titulo: 'administracion.protecciones.controlCumulo.grid.acciones',
                key: 'editar',
                configCelda: {
                    tipo: 'button',
                    cssIcon: 'icon-edit-3 text--blue1',
                    cssButton: 'btn btn--icon bg--blue2 mx-auto',
                    width: 100
                }
            }
        ];
    }
}
