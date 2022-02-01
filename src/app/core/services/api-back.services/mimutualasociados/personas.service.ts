import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  url = `${environment.miMutualAsociadosUrl}/mimPersona`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Jose Mulato
   * Función: Servicio que consulta registros por código
   * @param codigo Código
   */
  getPersona(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Jose Mulato
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getPersonas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }


  /**
   * Autor: Jose Mulato
   * Función: Actualizar registro
   * @param codigo Código
   * @param param Objeto de parametros
   */
  putPersona(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Jose Mulato
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postPersona(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Jose Mulato
   * Función: Eliminar registro
   * @param codigo
   */
  deletePersona(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
