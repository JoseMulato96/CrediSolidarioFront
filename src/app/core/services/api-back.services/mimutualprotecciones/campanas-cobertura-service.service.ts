import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CampanasCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimCampanaRelacion`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta todos los registros de campañas plan cobertura
   * @param param Objeto de parametros
   */
   getCampanasPlanCobertura(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta los estados del asegurado
   * @param param Objeto de parametros
   */
  getEstadoAsegurado(params: any): Observable<any> {
    return this.http.get(`${environment.miMutualProteccionesUrl}/mimEstadoAseguradoMP`, {params: params});
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta los beneficiarios cobertura
   * @param param Objeto de parametros
   */
   getBeneficiariosCobertura(params: any): Observable<any> {
    return this.http.get(`${environment.miMutualProteccionesUrl}/mimBeneficiarioCobertura`, {params: params});
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Servicio que consulta campañas plan cobertura por codigo
   * @param codigo Código de la campaña
   */
   getCampanaPlanCobertura(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
   postCampanaPlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Actualizar registro
   * @param codigo Código de la campaña plan cobertura
   * @param param Objeto de parametros
   */
   putCampanaPlanCobertura(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Eliminar registro
   * @param codigo
   */
   deleteCampanaPlanCobertura(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
