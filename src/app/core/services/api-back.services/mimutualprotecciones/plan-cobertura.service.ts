import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimPlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   */
  getPlanCobertura(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   */
  getPlanesCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   */
  putPlanCobertura(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  patchPlanCobertura(codigoCobertura: string, params: any): Observable<any> {
    return this.http.patch(`${this.url}/${codigoCobertura}/maximoEvento`, null, { params: params });
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postPlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   */
  deletePlanCobertura(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Duplicar plan cobertura completo
   * @param param Objeto de parametros
   */
  postDuplicarPlanCobertura(param: any): Observable<any> {
    return this.http.post(`${this.url}/duplicar`, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta registros por código de fondo
   */
   getPlanCoberturaFondo(codigoFondo: string): Observable<any> {
    return this.http.get(`${this.url}/fondo/${codigoFondo}`);
  }

}
