import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConceptosFacturacionPlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimConceptoFacturacionPlanCobertura`;

  constructor(private readonly http: HttpClient) { }


  getConceptosFacturacion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  getListadoConceptosFacturacion(params: any): Observable<any> {
    return this.http.get(`${this.url}/listadoConceptos`, {params});
  }


  postConceptoFacturacion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }


  deleteConceptoFacturacion(codigoProducto: string, codigoConcepto: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoProducto/${codigoProducto}/codigoConcepto/${codigoConcepto}`);
  }

}
