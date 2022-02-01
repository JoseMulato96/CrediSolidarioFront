import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  url = `${environment.miMutualProteccionesUrl}/mimPromocion`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Katherine Latorre
   * Función: Servicio que consulta registros por código
   * @param codigo Código de la promoción
   */
  getPromocion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Katherine Latorre
   * Función: Servicio que consulta todos los registros
   * @param params Objeto de parametros
   */
  getPromociones(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Katherine Latorre
   * Función: Actualizar registro
   * @param codigo Código de la promoción
   * @param param Objeto de parametros
   */
  putPromocion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Katherine Latorre
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postPromocion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Guardar registro con cargue de registros
   * @param param Objeto de parametros
   */
   postPromocionArchivo(param: any): Observable<any> {
    return this.http.post(`${this.url}/carguePromocion`,param);
  }

}
