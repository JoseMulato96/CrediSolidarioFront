import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EstadoProteccionesService {

  url = `${environment.miMutualProteccionesUrl}/mimEstadoProteccion`;

  constructor(private readonly http: HttpClient) { }

  getEstadosProtecciones(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

}

