import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimCuentaContableService {

  url = `${environment.miMutualProteccionesUrl}/mimCuenta`;

  constructor(private readonly http: HttpClient) { }

  getCuentaContable(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getCuentasContables(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

  postCuentaContable(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }

  putCuentaContable(codigo: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

}
