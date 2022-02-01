import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DeduciblesService {

  url = `${environment.miMutualProteccionesUrl}/mimDeducible`;

  constructor(private readonly http: HttpClient) { }

  obtenerDeducible(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerDeducibles(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  actualizarDeducible(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  crearDeducible(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  eliminarDeducible(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
