import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoValorProteccionService {

  url = `${environment.miMutualProteccionesUrl}/MimTipoValorProteccion`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposValorProteccion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
