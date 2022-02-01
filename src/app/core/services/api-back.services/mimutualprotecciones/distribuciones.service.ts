import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistribucionesService {

  private readonly url = `${environment.miMutualProteccionesUrl}/sipDistribuciones`;

  constructor(private readonly http: HttpClient) { }

  getDistribuciones(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

  postDistribuciones(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }

  putDistribuciones(codigo: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }
}
