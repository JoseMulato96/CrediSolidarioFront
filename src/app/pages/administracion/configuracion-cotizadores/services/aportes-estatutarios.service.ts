import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AportesEstatutariosService {

  private readonly url = `${environment.miMutualProteccionesUrl}/mimAporteEstatutario`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Función: Servicio que consulta registros por código
   * @param codigo Código del aporte
   */
  getAporteEstatutario(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Función: Servicio que consulta todos los registros
   * @param param Objeto de parametros
   */
  getAportesEstatutarios(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Función: Actualizar registro
   * @param codigo Código del aporte
   * @param param Objeto de parametros
   */
  putAporteEstatutario(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postAporteEstatutario(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Función: Eliminar registro
   * @param codigo
   */
  deleteAporteEstatutario(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
