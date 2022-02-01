
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimTipoIdentificacionService {
  constructor(private readonly http: HttpClient) { }

  obtenerTipoIdentificacion(codigo: string) {
    const url = `${environment.miMutualProteccionesUrl}/mimTipoIdentificacion/${codigo}`;
    return this.http.get(url);
  }

  obtenerTipoIdentificaciones(params: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimTipoIdentificacion`;
    return this.http.get(url, { params: params });
  }

  obtenerPorHref(href: string): Observable<any> {
    return this.http.get(href);
  }
}
