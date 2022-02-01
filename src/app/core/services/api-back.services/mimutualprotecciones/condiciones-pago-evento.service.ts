import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CondicionesPagoEventoService {

  url = `${environment.miMutualProteccionesUrl}/mimCondicionPagoEvento`;

  constructor(private readonly http: HttpClient) { }

  obtenerCondicionPagoEvento(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  guardarMimCondicionPagoEvento(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }


  eliminarCondicionPagoEvento(codigo: string): Observable<any> {
    return this.http.delete(`${this.url}/${codigo}`);
  }

  actualizarCondicionPagoEvento(codigo: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

}
