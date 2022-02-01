import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimReglasExcepcionesService {

  url = `${environment.miMutualProteccionesUrl}/mimReglasExcepciones`;


  constructor(private readonly http: HttpClient) { }

  obtenerReglasExcepciones(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  getReglaExcepcion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  putReglaExcepcion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postReglaExcepcion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }
}
