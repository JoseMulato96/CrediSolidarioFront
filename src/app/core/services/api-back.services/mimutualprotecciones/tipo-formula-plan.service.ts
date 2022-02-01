import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TipoFormulaPlanService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoFormulaPlan`;

  constructor(private readonly http: HttpClient) { }

  /**
   * Autor: Bayron Andres Perez M
   * Función: Servicio que consulta todos los registros
   * @param codigo Código del fondo
   */
  getTiposFormulaPlan(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

}
