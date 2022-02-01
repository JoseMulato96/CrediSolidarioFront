import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class PlanMediosFacturacionService {

  url = `${environment.miMutualProteccionesUrl}/mimPlanMedioFacturacion`;

  constructor(private readonly http: HttpClient) { }

  obtenerPlanMedioFacturacion(codigoPlan: string, codigoMedioFacturacion: string): Observable<any> {
    return this.http.get(`${this.url}/codigoPlan/${codigoPlan}/codigoMedioFacturacion/${codigoMedioFacturacion}`);
  }

  listarPlanMediosFacturacion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  crearPlanMedioFacturacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  actualizarPlanMedioFacturacion(codigoPlan: string, codigoMedioFacturacion: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoPlan/${codigoPlan}/codigoMedioFacturacion/${codigoMedioFacturacion}`, param);
  }


  eliminarPlanMedioFacturacion(codigoPlan: string, codigoMedioFacturacion: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoPlan/${codigoPlan}/codigoMedioFacturacion/${codigoMedioFacturacion}`);
  }
}
