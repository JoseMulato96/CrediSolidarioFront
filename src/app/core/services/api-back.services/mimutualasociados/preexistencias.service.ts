import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class PreexistenciasService {

  constructor(public http: HttpClient) { }

  /**
   *
   * @description Obtiene las preexistencias de un asociado.
   *
   * @param options Parametros de entrada.
   */
  getPreexistencias(options: any) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_preexistencia_diagnostico.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_preexistencia_diagnostico.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_preexistencia_diagnostico.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_preexistencia_diagnostico.observacion
    };
    const url = `${environment.miMutualAsociadosUrl}/asociados/${options.asoNumInt}/preexistencias?page=${options.page}&size=${options.size}`;
    return this.http.get(url, { headers: jsonHeaders });
  }

  /**
   * @description Obtiene una preexistencia de un asociado.
   *
   * @param options Parametros de entrada.
   */
  getPreexistencia(options: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${options.asoNumInt}/preexistencias/${options.preCod}`;
    return this.http.get(url);
  }

  /**
   * @description Obtiene el historico de una preexistencia.
   *
   * @param options Parametros de entrada
   */
  getHistoricoPreexistencia(options: any) {
    let url = `${environment.miMutualAsociadosUrl}/asociados/${options.asoNumInt}/preexistencias/historico`;
    url += `?diagCod=${options.diagCod}&preEstado=${options.preEstado}&diagEstado=${options.diagEstado}`;
    url += `&page=${options.page}&size=${options.size}`;
    return this.http.get(url);
  }

  /**
   * .
   * @description Almacena una preexistencia.
   * @param preexistencia Datos de la preexistencia.
   */
  crearPreexistencia(preexistencia: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${preexistencia.asoNumInt}/preexistencias`;
    return this.http.post(url, preexistencia);
  }

  actualizarPreexistencia(preexistencia: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${preexistencia.asoNumInt}/preexistencias`;
    return this.http.put(url, preexistencia);
  }

  /**
   * @description Almacena un IMC.
   */
  crearImc(indiceMasaCorporal: any): Observable<any> {
    const url = `${environment.miMutualAsociadosUrl}/mimIndicadorMasaCorporal`;
    return this.http.post(`${url}/actualizarIMC`, indiceMasaCorporal);
  }
}
