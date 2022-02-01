import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimFactoresContribucionService {

  url = `${environment.miMutualProteccionesUrl}/mimFactorContribucion`;

  constructor(private readonly http: HttpClient) { }

  getCargueTipoFactor(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getCargueTiposFactores(params: any): Observable<any> {
    return this.http.get(`${this.url}`, { params });
  }

  putCargueTipoFactor(codigo: any, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

}
