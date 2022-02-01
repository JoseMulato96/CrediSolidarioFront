import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConceptosFacturacionService {

  url = `${environment.miMutualProteccionesUrl}/mimConceptoFacturacionConfiguracion`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta registros por código
   * @param codigo Código de la enfermedad
   */
  getConceptoFacturacion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta todos los registros
   */
  getConceptosFacturacion(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Actualizar registro
   * @param codigo Código del concepto de facturacion
   * @param param Objeto de parametros
   */
  putConceptoFacturacion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postConceptoFacturacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Eliminar registro
   * @param codigo
   */
  deleteConceptoFacturacion(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
