import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ValorRescateService {

  url = `${environment.miMutualProteccionesUrl}/mimValorRescate`;

  constructor(private readonly http: HttpClient) { }

  getValorRescate(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getValoresRescate(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putValorRescate(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postValorRescate(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteValorRescate(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  obtenerBeneficiariosPagoValor(): Observable<any>{
    return this.http.get(`${environment.miMutualProteccionesUrl}/mimBeneficiarioPagoValorRescate`);
  }
}
