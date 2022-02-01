import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ControlAreaTecnicaService {

  url = `${environment.miMutualProteccionesUrl}/mimControlAreaTecnica`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta registros por código
   * @param codigo Código del control area tecnica
   */
  getControlAreaTecnica(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta todos los registros
   */
  getControlesAreasTecnicas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Actualizar registro
   * @param codigo Código del concepto de facturacion
   * @param param Objeto de parametros
   */
  putControlAreaTecnica(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postControlAreaTecnica(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Eliminar registro
   * @param codigo
   */
  deleteControlAreaTecnica(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
