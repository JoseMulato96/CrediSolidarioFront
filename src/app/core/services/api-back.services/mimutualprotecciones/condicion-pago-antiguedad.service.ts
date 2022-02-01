import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CondicionPagoAntiguedadService {

  url = `${environment.miMutualProteccionesUrl}/mimCondicionPagoAntiguedad`;

  constructor(private readonly http: HttpClient) { }

  getCondicionPagoAntiguedad(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getCondicionesPagoAntiguedad(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putCondicionPagoAntiguedad(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postCondicionPagoAntiguedad(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteCondicionPagoAntiguedad(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
