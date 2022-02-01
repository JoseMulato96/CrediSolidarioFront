import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable()
export class CapitalPagadoFacturacionAsociadoService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description Obtener los valores acumulados por productos
   * @return subscripcion
   */
  getCapitalPagado(asoNumInt: number) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_facturación_capital_pagado.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_facturación_capital_pagado.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_facturación_capital_pagado.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_facturación_capital_pagado.observacion
    };
    return this.http.get(
      `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/capitalpagado`, { headers: jsonHeaders }
    );
  }
}
