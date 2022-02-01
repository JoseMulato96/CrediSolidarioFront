import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoValorDevolverService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoValorDevolver`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposValorDevolver(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
