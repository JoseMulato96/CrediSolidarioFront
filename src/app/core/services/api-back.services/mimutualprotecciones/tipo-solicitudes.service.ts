import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudesService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoSolicitud`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del tipo solicitud
   */
  getTipoSolicitud(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param params filtros
   */
  getTipoSolicitudes(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }
}
