import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MimCotizacionService {

  url = `${environment.miMutualAsociadosUrl}/mimCotizacion`;

  constructor(private readonly http: HttpClient) { }

  getCotizaciones(param: any): Observable<any> {
    return this.http.get(this.url, { params: param });
  }

  getCotizacion(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  postCotizacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  putCotizacion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  patchCotizacion(codigo: string, param: any): Observable<any> {
    return this.http.patch(`${this.url}/${codigo}`, param);
  }

  postSimularCotizacion(params: any): Observable<any> {
    return this.http.post(`${this.url}/simular`, params);
  }

}
