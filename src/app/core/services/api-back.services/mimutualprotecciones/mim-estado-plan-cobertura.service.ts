import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimEstadoPlanCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimEstadoPlanCobertura`;

  constructor(private readonly http: HttpClient) { }

  obtenerEstadosPlanCobertura(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
