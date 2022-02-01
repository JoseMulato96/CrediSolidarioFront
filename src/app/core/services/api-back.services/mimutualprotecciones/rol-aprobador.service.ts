import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RolAprobadorService {

  url = `${environment.miMutualProteccionesUrl}/mimRolAprobador`;

  constructor(private readonly http: HttpClient) { }

  getRolAprobador(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getRolAprobadores(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putRolAprobador(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postRolAprobador(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteRolAprobador(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
