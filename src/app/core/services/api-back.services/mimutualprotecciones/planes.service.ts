import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  url = `${environment.miMutualProteccionesUrl}/mimPlan`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código
   */
  getPlan(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getPlanes(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  cambiarEstadoRequiereCargarFactor(codigo: any, status: any): Observable<any> {
    return this.http.get(`${this.url}/requiereCargarFactor/${codigo}/${status}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código
   * @param param Objeto de parametros
   */
  putPlan(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postPlan(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deletePlan(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
