import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosAsociadosService {

  asociadosUrl = `${environment.miMutualIntegracionesUrl}/multiactiva/asociado/`;

  constructor(private readonly http: HttpClient) { }

  obtenerAsociado(asoNumInt: any): Observable<any> {
    return this.http.get<Observable<any>>(`${this.asociadosUrl}${asoNumInt}`);
  }

  obtenerAsociadoDatosBasicos(params: any): Observable<any> {
    return this.http.get<Observable<any>>(`${this.asociadosUrl}obtenerAsociados2`, {params: params});
  }

  buscarAsociado(params: any): Observable<any> {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.consulta_datos_asociados.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.consulta_datos_asociados.ruta,
      Action: SIP_LOG_TRANSACCIONAL.consulta_datos_asociados.accion,
      Observation: SIP_LOG_TRANSACCIONAL.consulta_datos_asociados.observacion
    };

    return this.http.get<Observable<any>>(`${this.asociadosUrl}`, { headers: jsonHeaders, params: params });
  }

  getSalarioMinimo(fechaInicio: Date, fechaFin: Date) {
    return this.http.get(`${environment.miMutualUtilidadesUrl}/sipSmmlv/buscar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
  }

  getPrimaNivelada(asoNumInt: string) {
    return this.http.get(`${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/proteccionespignoradas/acumulado?estadoPignorado=${SERVICIOS_PARAMETROS.datosAsociados.estadoPignorado}&registroActual=${SERVICIOS_PARAMETROS.datosAsociados.registroActual}&tipoTransaccion=${SERVICIOS_PARAMETROS.datosAsociados.tipoTransaccion}`
    );
  }

  getNivelRiesgo(asoNumInt: string) {
    return this.http.get(`${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/nivelescondiciones?estado=${SERVICIOS_PARAMETROS.datosAsociados.estadoActivo}`);
  }

}
