import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { SubmenuConfiguracion } from '@shared/components/mim-menu-vertical/mim-menu-vertical.component';

export class BeneficiariosFechaNacimientoConfig {
    submenu: SubmenuConfiguracion;

    gridFechaNacimiento: MimGridConfiguracion = new MimGridConfiguracion();
    titulo = '';

    constructor() {
        this.gridFechaNacimiento.selectMode = false;
        this.gridFechaNacimiento.scrollHorizontal = false;

        this.gridFechaNacimiento.columnas = [
            {
                key: 'benDesCorTipIden',
                titulo: 'beneficiarios.actualizar.grid.tipoIdentificacion',
                configCelda: {
                    width: 250
                },
                isTrim: true
            },
            {
                key: 'benNumIdentificacion',
                titulo: 'beneficiarios.actualizar.grid.numeroIdentificacion',
                configCelda: {
                    tipo: 'link',
                    width: 290,
                    cssData: 'col-md-6'
                },
                isTrim: true
            },
            {
                key: 'benNomCompleto',
                titulo: 'beneficiarios.actualizar.grid.nombreApellidos',
                configCelda: {
                    width: 300
                },
                isTrim: true
            }
        ];
    }
}
