import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CumulosCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimCumulosPlanCobertura`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getCumuloCobertura(codigoCumulo: string, codigoPlanCobertura: string): Observable<any> {
    return this.http.get(`${this.url}/codigoCumulo/${codigoCumulo}/codigoPlanCobertura/${codigoPlanCobertura}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getCumulosCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del fondo
   * @param param Objeto de parametro
   */
  putCumuloCobertura(codigoCumulo: string, codigoCobertura: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoCumulo/${codigoCumulo}/codigoPlanCobertura/${codigoCobertura}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postCumuloCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteCumuloCobertura(codigoCumulo: string, codigoCobertura: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoCumulo/${codigoCumulo}/codigoPlanCobertura/${codigoCobertura}`);
  }
}
