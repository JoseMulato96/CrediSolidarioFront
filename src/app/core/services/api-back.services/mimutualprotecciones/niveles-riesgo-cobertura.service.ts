import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NivelesRiesgoCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimNivelRiesgoCobertura`;
  // urlEstados: string = `${environment.proteccionesUrl}/mimEstadoRiesgoCobetura`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getRiesgoCobetura(codigoNivelRiesgo: string, codigoCobertura: string): Observable<any> {
    return this.http.get(`${this.url}/codigoNivelRiesgo/${codigoNivelRiesgo}/codigoCobertura/${codigoCobertura}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getRiesgoCobeturas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametros
   */
  putRiesgoCobetura(codigoNivelRiesgo: string, codigoCobertura: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoNivelRiesgo/${codigoNivelRiesgo}/codigoCobertura/${codigoCobertura}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postRiesgoCobetura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteRiesgoCobetura(codigoNivelRiesgo: string, codigoCobertura: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoNivelRiesgo/${codigoNivelRiesgo}/codigoCobertura/${codigoCobertura}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta estados del fondo
   */
  /* getEstadosRiesgoCobetura():Observable<any>{
    return this.http.get(this.urlEstados);
  } */
}
