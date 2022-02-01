import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FrecuenciaFacturacionService {
  url = `${environment.miMutualProteccionesUrl}/mimFrecuenciaFacturacion`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código
   */
  getFrecuenciaFacturacion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/codigo/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código
   */
  getFrecuenciasFacturaciones(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código
   * @param param Objeto de parametros
   */
  putFrecuenciaFacturacion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigo/${codigo}`, param);
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
  deleteFrecuenciaFacturacion(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/codigo/${codigo}`);
  }
}
