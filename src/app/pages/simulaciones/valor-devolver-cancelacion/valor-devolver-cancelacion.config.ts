import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { MimFiltroVerticalComponentConfig } from '@shared/components/mim-filtro-vertical/mim-filtro-vertical.component';

export class ValorDevolverCancelarConfig {
    gridValorDevolverCancelar: MimGridConfiguracion = new MimGridConfiguracion();

    barFilter: MimFiltroVerticalComponentConfig = {};

    constructor() {
        this.gridValorDevolverCancelar.scrollHorizontal = false;
        this.gridValorDevolverCancelar.paginarDatos = false;
        this.gridValorDevolverCancelar.mostrarPaginador = false;
        this.gridValorDevolverCancelar.tamano = 12;
        this.gridValorDevolverCancelar.columnas = [
            {
                key: 'nombre',
                titulo: 'simulaciones.valorDevolver.gridDetalle.nombreDetalle',
                configCelda: {
                    width: 120
                }
            },
            {
                key: 'valor',
                titulo: 'simulaciones.valorDevolver.gridDetalle.valores',
                configCelda: {
                    width: 120
                }
            }
        ];
    }
}
