import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimPeriodoService {

  url = `${environment.miMutualProteccionesUrl}/mimPeriodo`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Katherine Latorre
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getPeriodosCargueFactores(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

  aprobar(codigo): Observable<any> {
    return this.http.post(`${this.url}/aprobar/${codigo}`, {});
  }

  eliminar(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
