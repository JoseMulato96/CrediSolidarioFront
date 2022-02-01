import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MimAsignacionDiariaService {

  url = `${environment.miMutualFlowableUrl}/mimAsignacionDiaria`;

  constructor(private readonly http: HttpClient) { }

  getConfiguracionesGestionDiaria(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  getConfiguracionGestionDiaria(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  crearConfiguracionGestionDiaria(configuracionGestionDiaria: any): Observable<any> {
    return this.http.post(this.url, configuracionGestionDiaria);
  }

  editarConfiguracionGestionDiaria(codigo: string, configuracionGestionDiaria: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, configuracionGestionDiaria);
  }

  eliminarConfiguracionGestionDiaria(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
