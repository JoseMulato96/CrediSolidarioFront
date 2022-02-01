import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimVentaService {

  private readonly url = `${environment.miMutualAsociadosUrl}/mimVenta`;

  constructor(private readonly http: HttpClient) { }

  getVenta(param: any): Observable<any> {
    return this.http.get(this.url, { params: param });
  }

  postVenta(param: any): Observable<any> {
    return this.http.post(`${this.url}/guardarFlujo`, param);
  }

  postVentaActualizar(param: any): Observable<any> {
    return this.http.post(`${this.url}/actualizarFlujo`, param);
  }

  postGestionListasRestrictivas(param: any): Observable<any> {
    return this.http.post(`${this.url}/gestionListasRestrictivas`, param);
  }

  postAuditoriaMedica(param: any): Observable<any> {
    return this.http.post(`${this.url}/auditoriaMedica`, param);
  }

  postSolicitarInformacion(param: any): Observable<any> {
    return this.http.post(`${this.url}/solicitarInformacion`, param);
  }

  postValidarListasRestrictivas(venta: any): Observable<any> {
    return this.http.post(`${this.url}/validarListasRestrictivas`, venta);
  }

  postActivarSolicitudesSuspendidas(venta: any): Observable<any> {
    return this.http.post(`${this.url}/activar`, venta);
  }

  postGestionMesaControl(param: any): Observable<any> {
    return this.http.post(`${this.url}/gestionMesaControl`, param);
  }

  postGestionAreaTecnica(param: any): Observable<any> {
    return this.http.post(`${this.url}/gestionAreaTecnica`, param);
  }

  postAnularVenta(param: any): Observable<any> {
    return this.http.post(`${this.url}/anular`, param);
  }

  postGenerarFormatoVenta(params: any, body: any): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(
      `${this.url}/pdfVenta`, body, {
      observe: 'response',
      responseType: 'blob' as 'json',
      params: params
    });
  }

}
