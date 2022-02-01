import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PeriodosCarenciaService {

  url = `${environment.miMutualProteccionesUrl}/mimPeriodoCarencia`;

  constructor(private readonly http: HttpClient) { }

  obtenerPeriodoCarencia(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerPeriodosCarencia(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  actualizarPeriodoCarencia(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  crearPeriodoCarencia(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  eliminarPeriodoCarencia(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
