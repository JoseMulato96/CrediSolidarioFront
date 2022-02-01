import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class SipintliqService {

  url = `${environment.miMutualReclamacionesUrl}/sipintliq`;

  constructor(private readonly http: HttpClient) { }

  buscar(params: any) {
    const headers = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_informacion_pagos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_informacion_pagos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_informacion_pagos.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_informacion_pagos.observacion
    };

    return this.http.get(this.url, { params: params, headers: headers });
  }
}
