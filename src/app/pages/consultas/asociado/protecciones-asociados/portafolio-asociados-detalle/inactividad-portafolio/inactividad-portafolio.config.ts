import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';

export class InactividadPortafolioConfig {
  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: grid de las tablas
   */
  gridInactividad: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    this.gridInactividad.columnas = [
      { key: 'periodo', titulo: 'Periodo' },
      { key: 'fechaInicio', titulo: 'Fecha Inicio' },
      { key: 'fechaFin', titulo: 'Fecha Final' },
      { key: 'fechaRegistro', titulo: 'Fecha registro' }
    ];
  }
}
