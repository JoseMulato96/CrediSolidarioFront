import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CausasIndmnizacionService {

  url = `${environment.miMutualProteccionesUrl}/mimCausaIndemnizacion`;

  constructor(private readonly http: HttpClient) { }

  getCausasIndenizaciones(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
