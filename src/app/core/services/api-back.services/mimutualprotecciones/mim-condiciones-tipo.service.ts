import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimCondicionesTipoService {

  url = `${environment.miMutualProteccionesUrl}/mimCondicionesTipo`;

  constructor(private readonly http: HttpClient) { }

  getCotizacionesTipo(param: any): Observable<any> {
    return this.http.get(this.url, { params: param });
  }

}
