import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PromotorService {

  url = `${environment.miMutualProteccionesUrl}/mimPromotor`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param numeroIdentificacion Código del promotor
   */
  getPromotor(numeroIdentificacion: string): Observable<any> {
    return this.http.get(`${this.url}/${numeroIdentificacion}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param params filtros
   */
  getPromotores(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param numeroIdentificacion numeroIdentificacion del promotor
   * @param param Objeto de parametros
   */
  putPromotor(numeroIdentificacion: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${numeroIdentificacion}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postPromotor(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param numeroIdentificacion
   */
  deletePromotor(numeroIdentificacion: string): Observable<any> {
    return this.http.delete(`${this.url}/${numeroIdentificacion}`);
  }
}
