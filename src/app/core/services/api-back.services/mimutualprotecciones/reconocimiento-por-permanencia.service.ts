import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReconocimientoPorPermanenciaService {

  url = `${environment.miMutualProteccionesUrl}/mimReconocimientoPorPermanencia`;

  constructor(private readonly http: HttpClient) { }

  getReconocimientoPorPermanencia(codigo: number): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getReconocimientosPorPermanencia(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putReconocimientoPorPermanencia(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postReconocimientoPorPermanencia(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteReconocimientoPorPermanencia(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
