import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimAdicionalPlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimAdicionalPlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  getAdicionalPlanCobertura(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getAdicionalPlanesCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putAdicionalPlanCobertura(codigo, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  postAdicionalPlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteAdicionalPlanCobertura(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
