import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ExcepcionDiagnosticoService {

  url = `${environment.miMutualProteccionesUrl}/mimExcepcionDiagnostico`;

  constructor(private readonly http: HttpClient) { }

  getExcepcionDiagnostico(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getExcepcionesDiagnosticos(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putExcepcionDiagnostico(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postExcepcionDiagnostico(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteExcepcionDiagnostico(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
