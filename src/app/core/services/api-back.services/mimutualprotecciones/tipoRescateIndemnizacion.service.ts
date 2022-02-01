import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TipoRescateIndemnizacionService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoRescateIndemnizacion`;

  constructor(private readonly http: HttpClient) { }

  getTipoRescateIndemnizacion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/codigo/${codigo}`);
  }

  getTipoRescateIndemnizaciones(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putTipoRescateIndemnizacion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigo/${codigo}`, param);
  }

  postTipoRescateIndemnizacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteTipoRescateIndemnizacion(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/codigo/${codigo}`);
  }
}
