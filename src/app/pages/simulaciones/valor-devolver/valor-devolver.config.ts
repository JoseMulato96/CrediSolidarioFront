import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';

export class ValorDevolverConfig {
    gridValorDevolver: MimGridConfiguracion = new MimGridConfiguracion();

    barFilter: MimFiltroVerticalComponentConfig = {};

    constructor() {
        this.gridValorDevolver.scrollHorizontal = false;
        this.gridValorDevolver.paginarDatos = true;
        this.gridValorDevolver.mostrarPaginador = true;
        this.gridValorDevolver.columnas = [
            {
                key: 'concepto',
                titulo: 'simulaciones.valorDevolver.grid.concepto',
                configCelda: {
                    width: 100,
                    tipo: 'link'
                }
            }, {
                key: 'descripcion',
                titulo: 'simulaciones.valorDevolver.grid.descripcion',
                configCelda: {
                    width: 180
                }
            },
            {
                key: 'plan',
                titulo: 'simulaciones.valorDevolver.grid.plan',
                configCelda: {
                    width: 150
                }
            },
            {
                key: 'valorProteccion',
                titulo: 'simulaciones.valorDevolver.grid.valorProteccion',
                configCelda: {
                    width: 90,
                    tipo: 'currency'
                }
            }, {
                key: 'valorCuota',
                titulo: 'simulaciones.valorDevolver.grid.valorCuota',
                configCelda: {
                    width: 90,
                    tipo: 'currency'
                }
            }, {
                key: 'fechaPerseverancia',
                titulo: 'simulaciones.valorDevolver.grid.fechaPerseverancia',
                configCelda: {
                    width: 85
                }
            }
        ];
    }
}
