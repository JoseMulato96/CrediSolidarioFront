import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimEventoService {
  url = `${environment.miMutualProteccionesUrl}/mimEvento`;
  constructor(private readonly http: HttpClient) { }

  obtenerEventos(params: any): Observable<any> {

    return this.http.get(this.url, { params: params });
  }
}
