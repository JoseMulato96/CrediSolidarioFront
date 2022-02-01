import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CondicionesVentaService {

  url = `${environment.miMutualProteccionesUrl}/mimCondicionVenta`;

  constructor(private readonly http: HttpClient) { }

  getCondicionesVentas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putCondicionesVenta(codigoCondicionesVenta: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigoCondicionesVenta}`, param);
  }

  postCondicionesVenta(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  deleteCondicionesVenta(codigoCondicionesVenta: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigoCondicionesVenta}`);
  }
}
