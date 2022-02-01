import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReclamacionesService {

  url = environment.miMutualReclamacionesUrl;

  constructor(private readonly http: HttpClient) { }

  /**
    * @author Jorge Luis Caviedes Alvarado
    * @description Obtener las reclamaciones
    */
  getReclamaciones(option: any = {}) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_información_reclamaciones.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_información_reclamaciones.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_información_reclamaciones.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_información_reclamaciones.observacion
    };

    return this.http.get(`${this.url}/sipReclamaciones/buscar`, {
      params: option, headers: jsonHeaders
    });
  }

  /**
    * @author Jorge Luis Caviedes Alvarado
    * @description obtener los daros de la reclamacion
    */
  getReclamacion(recCodigo: any, option: any = {}) {
    return this.http.get(`${this.url}/sipReclamaciones/${recCodigo}`, { params: option });
  }

  radicar(params: any) {
    return this.http.post(`${this.url}/sipReclamaciones/radicar`, params);
  }


  /**
    * @author Jorge Luis Caviedes Alvarado
    * @description Obtener las reclamaciones
    */
  getBitacora(idProceso, option: any = {}): Observable<any> {
    const url = `${environment.miMutualBpmUrl}/caseManagement/${idProceso}/casos?managementStates=P`;
    return this.http.get(url, {
      params: option
    });
  }

  /**
   * @description Obtiene una renta.
   * @param params  Parametros de busqueda
   */
  getRentas(params: any = {}) {
    return this.http.get(`${this.url}/sipRentas`, { params: params });
  }

  getReclamacionPorAuxilio(params: any) {
    return this.http.get(`${this.url}/sipReclamaciones/auxilios`, { params: params });
  }

}
