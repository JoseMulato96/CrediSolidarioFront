import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelacionDistribucionCuentaService {

  url = `${environment.miMutualProteccionesUrl}/mimCuentaContableDistribucion`;

  constructor(private readonly http: HttpClient) { }

  getRelacionDistribucionCuentas(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

  getMimCoberturaPlanDistribucion(params: any): Observable<any> {
    return this.http.get(`${this.url}/mimCoberturaPlanDistribucion/${params.codigoPlan}/${params.codigoConceptoDistribucion}`);
  }

  postRelacionDistribucionCuenta(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }

  putRelacionDistribucionCuenta(params: any): Observable<any> {
    return this.http.put(this.url, params);
  }

  getCoberturasPorDistribucion(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/listaCuentasContablesEditar/${codigo}`);
  }

}
