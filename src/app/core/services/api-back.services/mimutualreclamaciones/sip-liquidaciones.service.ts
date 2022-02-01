import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class SipLiquidacionesService {

  url = `${environment.miMutualReclamacionesUrl}/sipLiquidaciones`;

  constructor(private readonly http: HttpClient) { }

  getLiquidaciones(params: any = {}) {
    const headers = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_información_liquidaciones.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_información_liquidaciones.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_información_liquidaciones.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_información_liquidaciones.observacion
    };
    return this.http.get(this.url, {
      params: params, headers: headers
    });
  }

  getDetalleLiquidacion(numeroLiquidacion: string, params: any = {}) {
    const url = `${this.url}/${numeroLiquidacion}/detalle`;
    return this.http.get(url, { params: params });
  }

}
