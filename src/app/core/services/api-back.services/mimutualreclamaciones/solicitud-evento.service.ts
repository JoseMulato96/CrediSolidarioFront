import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEventoService {

  url = `${environment.miMutualReclamacionesUrl}/mimSolicitudEvento`;
  urlReclamaciones = `${environment.miMutualReclamacionesUrl}`;

  constructor(private readonly http: HttpClient) { }

  getSolicitudEvento(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getSolicitudesEvento(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }

  postSolicitudEvento(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  putSolicitudEvento(codigo: string, param: string): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  getValidaRegistroSolicitudesEvento(param: any): Observable<any> {
    return this.http.get(`${this.url}/validaRegistroEvento`, {params: param});
  }

  postRegistro(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/registrar`, param);
  }

  postRadicar(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/radicar`, param);
  }

  postAuditoriaMedica(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/auditoriaMedica`, param);
  }

  postLiquidar(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/liquidar`, param);
  }

  postPagar(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/pagar`, param);
  }

  postNotificarNegacion(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/notificarNegacion`, param);
  }

  postActivar(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/activar`, param);
  }

  postAnular(param: any, codigoEvento: string): Observable<any> {
    return this.http.post(`${this.urlReclamaciones}/${codigoEvento}/anular`, param);
  }

  getValorBase(param: any): Observable<any> {
    return this.http.get(`${this.urlReclamaciones}/mimValorAsegurado/valorBase`, {params: param});
  }

  getAmparosPagados(param: any): Observable<any> {
    return this.http.get(`${this.url}/amparosPagados`, {params: param});
  }

}
