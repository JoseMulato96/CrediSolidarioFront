import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CondicionesService {

  url = `${environment.miMutualProteccionesUrl}/mimCondiciones`;

  constructor(private readonly http: HttpClient) { }

  obtenerCondicion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerCondiciones(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  actualizarCondicion(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  crearCondicion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  eliminarCondicion(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
