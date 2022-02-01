import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoAporteService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoAporte`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposAporte(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}