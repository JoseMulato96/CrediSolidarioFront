import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SublimitesCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimSublimiteCobertura`;

  constructor(private readonly http: HttpClient) { }

  obtenerSublimitesCobertura(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  guardarSublimitesCobertura(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }


  eliminarSublimiteCobertura(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  actualizarSublimiteCobertura(codigo: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

}
