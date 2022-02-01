import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class MultiactivaService {
  constructor(private readonly http: HttpClient) { }

  url = `${environment.miMutualIntegracionesUrl}/multiactiva`;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene los datos de multiactiva
   */
  getMultiactivaDatos(asoNumInt: any, pagina: number, tamano: number) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_multiactiva.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_multiactiva.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_multiactiva.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_multiactiva.observacion
    };
    return this.http.get(
      `${this.url}/facturacion?asoNumInt=${asoNumInt}&page=${pagina}&size=${tamano}`
      , { headers: jsonHeaders }
    );
  }

  getUbicaciones(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/codigos/codtab?codTab=${codigo}`);
  }

}
