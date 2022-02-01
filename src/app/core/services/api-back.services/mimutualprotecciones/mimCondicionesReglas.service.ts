import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimCondicionesReglasService {

  url = `${environment.miMutualProteccionesUrl}/mimCondicionesReglas`;

  constructor(private readonly http: HttpClient) { }

  getMimCondicionRegla(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getMimCondicionesReglas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putMimCondicionRegla(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postMimCondicionRegla(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteMimCondicionRegla(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  getCondicionesReglasAutocompletar(texto: string) {
    return this.http.get(`${this.url}/autocomplete?texto=${texto}`);
  }
}
