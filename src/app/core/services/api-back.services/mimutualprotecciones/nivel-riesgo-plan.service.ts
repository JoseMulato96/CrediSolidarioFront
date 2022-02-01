import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NivelRiesgoPlanService {

  url = `${environment.miMutualProteccionesUrl}/mimPlanNivelRiesgo`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigoPlan
   * @param codigoNivelRiesgo
   */
  getNivelRiesgoPlan(codigoPlan: string, codigoNivelRiesgo: string): Observable<any> {
    return this.http.get(`${this.url}/codigoPlan/${codigoPlan}/codigoNivelRiesgo/${codigoNivelRiesgo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getNivelesRiesgosPlanes(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametros
   */
  putNivelRiesgoPlan(codigoPlan: string, codigoNivelRiesgo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoPlan/${codigoPlan}/codigoNivelRiesgo/${codigoNivelRiesgo}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postNivelRiesgoPlan(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigoPlan
   * @param codigoNivelRiesgo
   */
  deleteNivelRiesgoPlan(codigoPlan: string, codigoNivelRiesgo: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoPlan/${codigoPlan}/codigoNivelRiesgo/${codigoNivelRiesgo}`);
  }
}
