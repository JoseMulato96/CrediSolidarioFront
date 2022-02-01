import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ExclusionesCoberturaService {
  url = `${environment.miMutualProteccionesUrl}/mimExclusionCobertura`;
  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getExclusionCobertura(codigoExclusion: string, codigoCobertura: string): Observable<any> {
    return this.http.get(`${this.url}/codigoExclusion/${codigoExclusion}/codigoCobertura/${codigoCobertura}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getExclusionesCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametros
   */
  putExclusionCobertura(codigoExclusion: string, codigoCobertura: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoExclusion/${codigoExclusion}/codigoCobertura/${codigoCobertura}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postExclusionCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteExclusionCobertura(codigoExclusion: string, codigoCobertura: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoExclusion/${codigoExclusion}/codigoCobertura/${codigoCobertura}`);
  }
}
