import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosExcluyentesService {

  url = `${environment.miMutualProteccionesUrl}/mimProductoExcluyente`;

  constructor(private readonly http: HttpClient) { }

  getProductoExcluyente(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getProductosExcluyentes(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  putProductoExcluyente(codigo: any, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

  postProductoExcluyente(params: any): Observable<any> {
    return this.http.post(`${this.url}`, params);
  }

  deleteProductoExcluyente(codigoProductoExcluyente: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigoProductoExcluyente}`);
  }
}
