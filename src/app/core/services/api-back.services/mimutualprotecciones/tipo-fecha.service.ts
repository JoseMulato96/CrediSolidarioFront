import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoFechaService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoFecha`;

  constructor(private readonly http: HttpClient) { }

  getTiposFecha(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
