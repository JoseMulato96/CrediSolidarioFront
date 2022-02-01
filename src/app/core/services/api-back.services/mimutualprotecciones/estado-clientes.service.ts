import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoClientesService {
  constructor(private readonly http: HttpClient) { }

  obtenerEstadoClientes(params: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimEstadoCliente`;
    return this.http.get(url, { params: params });
  }
}
