import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FormulaPlanService {

  url = `${environment.miMutualProteccionesUrl}/mimFormulaPlan`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta registros por código
   * @param codigo Código de la formula plan
   */
  getFormulaPlan(codigoFormulaPlan: string): Observable<any> {
    return this.http.get(`${this.url}/${codigoFormulaPlan}`);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Servicio que consulta todos los registros
   */
  getFormulasPlan(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Actualizar registro
   * @param codigo Código de la formula plan
   * @param param Objeto de parametros
   */
  putFormulaPlan(codigoFormulaPlan: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigoFormulaPlan}`, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postFormulaPlan(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Eliminar registro
   * @param codigo
   */
  deleteFormulaPlan(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
