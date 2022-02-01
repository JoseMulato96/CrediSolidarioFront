import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimTipoCotizacionService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoCotizacion`;

  constructor(private readonly http: HttpClient) { }

  getTipoCotizacion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
