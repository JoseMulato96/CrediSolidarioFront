import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoValorAseguradoService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoValorAsegurado`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposValoresAsegurados(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
