import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ExclusionPlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimExclusionPlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  getExclusionPlanCobertura(codigoExclusion: string, codigoPlanCobertura: string): Observable<any> {
    return this.http.get(`${this.url}/codigoExclusion/${codigoExclusion}/codigoPlanCobertura/${codigoPlanCobertura}`);
  }

  getExclusionesPlanesCoberturas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putExclusionPlanCobertura(codigoExclusion: number, codigoPlanCobertura: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoExclusion/${codigoExclusion}/codigoPlanCobertura/${codigoPlanCobertura}`, param);
  }

  postExclusionPlanCobertura(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteExclusionPlanCobertura(codigoExclusion: string, codigoPlanCobertura: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoExclusion/${codigoExclusion}/codigoPlanCobertura/${codigoPlanCobertura}`);
  }
}
