import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimAsistenciaPlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimAsistenciaPlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  obtenerAsistenciaPlanCobertura(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/codigo/${codigo}`);
  }

  obtenerAsistenciasPlanCobertura(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  actualizarAsistenciaPlanCobertura(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigo/${codigo}`, param);
  }

  crearAsistenciaPlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  eliminarAsistenciaPlanCobertura(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/codigo/${codigo}`);
  }
}
