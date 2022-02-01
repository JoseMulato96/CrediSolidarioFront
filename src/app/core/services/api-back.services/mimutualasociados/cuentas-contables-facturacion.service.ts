import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class CuentasContablesFacturacionService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Hander Fernando Gutierrez Cordoba
   * @description obtiene los datos de cuentas contables
   */
  getCuentasContables(asoNumInt: any, options: any = {}) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_cuentas_contables_facturacion.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_cuentas_contables_facturacion.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_cuentas_contables_facturacion.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_cuentas_contables_facturacion.observacion
    };
    const url = `${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/cuentascontables/buscarCuentasContables`;
    return this.http.get(url, { params: options, headers: jsonHeaders });
  }

  /**
  * @author Hander Fernando Gutierrez Cordoba
  * @description Obtiene el detalle de cuentas contables.
  * @param options Parametros de la consulta.
  */
  getCuentasContablesDetalle(asoNumInt: string, options: any = {}) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/cuentascontables/buscarCuentasContablesPagos`;
    return this.http.get(url, { params: options });
  }

}
