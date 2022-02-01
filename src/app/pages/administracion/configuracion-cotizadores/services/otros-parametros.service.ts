import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class OtrosParametrosService {

  private readonly url = `${environment.miMutualAsociadosUrl}/mimOtroParametro`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta otros parametros por codigo
   * @param codigo Código del otro parametro
   */
  getOtroParametro(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta todos los registros
   * @param param Objeto de parametros
   */
  getOtrosParametros(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Actualizar registro
   * @param codigo Código del otro parametro
   * @param param Objeto de parametros
   */
  putOtrosParametros(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }
}
