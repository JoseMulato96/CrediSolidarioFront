import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ValorAseguradoService {

  url = `${environment.miMutualProteccionesUrl}/mimValorAsegurado`;

  constructor(private readonly http: HttpClient) { }

  obtenerValorAsegurado(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerValoresAsegurados(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  actualizarValorAsegurado(codigo: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

  crearValorAsegurado(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  eliminarValorAsegurado(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  obtenerOpcionesPresentacionPortafolio(): Observable<any>{
    return this.http.get(`${environment.miMutualProteccionesUrl}/mimPresentacionPortafolio`);
  }
}
