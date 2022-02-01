import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ProyectoVidaService {

  private readonly url = `${environment.miMutualProteccionesUrl}/mimProyectoVida`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del proyecto de vida
   */
  getProyectoVida(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param param Objeto de parametros
   */
  getProyectoVidas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del proyecto de vida
   * @param param Objeto de parametros
   */
  putProyectoVida(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postProyectoVida(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteProyectoVida(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
