import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDeducibleService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoDeducible`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposDeducibles(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
