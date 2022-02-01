import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EnfermedadGravePlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimEnfermedadGravePlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  getEnfermedadesGraves(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putEnfermedadGrave(codigoPlanCobertura: string, codigoEnfermedadGrave: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoPlanCobertura/${codigoPlanCobertura}/codigoEnfermedadGrave/${codigoEnfermedadGrave}`, param);
  }

  postEnfermedadGrave(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteEnfermedadGrave(codigoPlanCobertura: string, codigoEnfermedadGrave: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoPlanCobertura/${codigoPlanCobertura}/codigoEnfermedadGrave/${codigoEnfermedadGrave}`);
  }
}
