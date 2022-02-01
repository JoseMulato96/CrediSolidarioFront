import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CampanaService {

  url = `${environment.miMutualProteccionesUrl}/mimCampanaEndoso`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta todos los registros de campañas
   * @param param Objeto de parametros
   */
   getCampanas(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta campañas por codigo
   * @param codigo Código de la campaña
   */
   getCampana(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
   postCampana(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Actualizar registro
   * @param codigo Código de la campaña
   * @param param Objeto de parametros
   */
   putCampana(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Eliminar registro
   * @param codigo
   */
   deleteCampana(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
