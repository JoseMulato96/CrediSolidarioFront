import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TiposMovimientosService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoMovimiento`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código
   */
  getTipoMovimiento(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getTiposMovimientos(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código
   * @param param Objeto de parametros
   */
  putTipoMovimiento(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postTipoMovimiento(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteTipoMovimiento(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
