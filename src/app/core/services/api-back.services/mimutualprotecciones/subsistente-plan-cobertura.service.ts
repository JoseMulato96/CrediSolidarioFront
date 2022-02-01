import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SubsistentePlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimSubsistentePlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  getSubsistentePlanCobertura(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getSubsistentesPlanesCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putSubsistentePlanCobertura(codigoCoberturaIndemnizada: string, codigoPlan: string, codigoPlanCobertura: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoCoberturaIndemnizada/${codigoCoberturaIndemnizada}/codigoPlan/${codigoPlan}/codigoPlanCobertura/${codigoPlanCobertura}`, param);
  }

  postSubsistentePlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteSubsistentePlanCobertura(codigoCoberturaIndemnizada: string, codigoPlan: any, codigoPlanCobertura: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoCoberturaIndemnizada/${codigoCoberturaIndemnizada}/codigoPlan/${codigoPlan}/codigoPlanCobertura/${codigoPlanCobertura}`);
  }
}
