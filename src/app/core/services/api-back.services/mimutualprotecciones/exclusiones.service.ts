import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ExclusionesService {

  url = `${environment.miMutualProteccionesUrl}/mimExclusion`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getExclusion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getExclusiones(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametros
   */
  putExclusion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postExclusion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteExclusion(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  /**
   * @description Obtiene diagnosticos
   * @param texto Texto a buscar.
   */
   getDiagnosticos(texto: string) {
    const url = `${environment.miMutualUtilidadesUrl}/sipDiagnosticos/autocomplete?texto=${texto}`;
    return this.http.get(url);
  }
}
