import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class FrecuenciaFacturacionPlanService {

  url = `${environment.miMutualProteccionesUrl}/mimPlanFrecuenciaFacturacion`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getFrecuenciaFacturacion(codigoPlan: string, codigoFrecuenciaFacturacion: string): Observable<any> {
    return this.http.get(`${this.url}/codigoPlan/${codigoPlan}/codigoFrecuenciaFacturacion/${codigoFrecuenciaFacturacion}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getFrecuenciasFacturaciones(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametros
   */
  putFrecuenciaFacturacion(codigoPlan: string, codigoFrecuenciaFacturacion: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoPlan/${codigoPlan}/codigoFrecuenciaFacturacion/${codigoFrecuenciaFacturacion}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postFrecuenciaFacturacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteFrecuenciaFacturacion(codigoPlan: string, codigoFrecuenciaFacturacion: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoPlan/${codigoPlan}/codigoFrecuenciaFacturacion/${codigoFrecuenciaFacturacion}`);
  }
}
