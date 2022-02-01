import { MimGridConfiguracion } from '@shared/components/mim-grid/mim-grid-configuracion';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';

export class HistoricoPortafolioConfig {

  gridHistorico: MimGridConfiguracion = new MimGridConfiguracion();

  constructor() {
    // do nothing
  }

  /**
   * .
   * @description Retorna la configuracion de la grilla de historico de protecciones.
   * @param prodCod Codigo de producto.
   * @return Las columnas de la tabla
   */
  configurarColumnasTablaHistorico(codigoCategoria: number): any[] {
    if (codigoCategoria === APP_PARAMETROS.PROTECCIONES.CATEGORIA_PROTECCION.AUXILIO_FUNERARIO) {
      this.gridHistorico.columnas = [
        { key: 'ano', titulo: 'asociado.protecciones.historico.anio' },
        {
          key: 'proValor',
          titulo: 'asociado.protecciones.historico.valorProteccion'
        },
        {
          key: 'proCuota',
          titulo: 'global.fee',
          configCelda: { tipo: 'currency' }
        },
        {
          key: 'proFactorValor', titulo: 'asociado.protecciones.historico.factor',
          configCelda: { tipo: 'numero' }
        },
        { key: 'proEstadoProteccionNombre', titulo: 'asociado.protecciones.historico.estadoProteccion' },
        { key: 'proEstadoNombre', titulo: 'global.status' }
      ];
    } else {
      this.gridHistorico.columnas = [
        { key: 'ano', titulo: 'asociado.protecciones.historico.anio' },
        {
          key: 'proValor',
          titulo: 'asociado.protecciones.historico.valorProteccion',
          configCelda: { tipo: 'currency' }
        },
        {
          key: 'proCuota',
          titulo: 'global.fee',
          configCelda: { tipo: 'currency' }
        },
        {
          key: 'proFactorValor', titulo: 'asociado.protecciones.historico.factor',
          configCelda: { tipo: 'numero' }
        },
        { key: 'proEstadoProteccionNombre', titulo: 'asociado.protecciones.historico.estadoProteccion' },
        { key: 'proEstadoNombre', titulo: 'global.status' }
      ];
    }

    return this.gridHistorico.columnas;
  }
}
