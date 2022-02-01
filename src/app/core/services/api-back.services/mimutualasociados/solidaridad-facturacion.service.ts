import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class SolidaridadFacturacionService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description obtiene los datos de Solidaridad
   */
  getSolidaridadDatos(options: any) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_solidaridad.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_solidaridad.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_solidaridad.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_solidaridad.observacion
    };
    return this.http.get(
      `${
      environment.miMutualAsociadosUrl
      }/asociados/${options.asoNumInt}/facturacion/detalle?codParamEstadoFac=${options.codParamEstadoFac}&page=${options.pagina}&size=${options.tamano}&exportar=${options.exportar}`
      , { headers: jsonHeaders }
    );
  }

  /**
  *
  * @description Obtiene el detalle del recaudo seleccionado.
  * @param options Parametros de la consulta.
  */
  getSolidaridadDetalle(options: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${options.asoNumInt}/mora/buscar?prodCodigo=${options.prodCodigo}&periodo=${options.periodo}`;
    return this.http.get(url);
  }

}
