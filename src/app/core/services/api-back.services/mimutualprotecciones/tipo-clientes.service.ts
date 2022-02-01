
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoClientesService {
  constructor(private readonly http: HttpClient) { }

  obtenerTipoCliente(codigo: string, nested: any = {}) {
    const url = `${environment.miMutualProteccionesUrl}/mimTipoCliente/${codigo}`;
    return this.http.get(url);
  }

  obtenerTipoClientes(params: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimTipoCliente`;
    return this.http.get(url, { params: params });
  }
}
