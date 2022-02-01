import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoValorRestitucionService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoValorRestitucion`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposValoresRestitucion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
