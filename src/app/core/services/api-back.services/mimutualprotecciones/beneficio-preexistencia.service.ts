import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BeneficioPreexistenciaService {

  url = `${environment.miMutualProteccionesUrl}/mimBeneficioPreexistencia`;

  constructor(private readonly http: HttpClient) { }


  getBeneficiosPreexistencia(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }


  putBeneficioPreexistencia(codigo: number, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }


  postBeneficioPreexistencia(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }


  deleteBeneficioPreexistencia(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }
}
