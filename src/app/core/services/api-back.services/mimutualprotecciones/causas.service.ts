import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CausasService {

  url = `${environment.miMutualProteccionesUrl}/mimCausa`;

  constructor(private readonly http: HttpClient) { }

  obtenerCausas(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
