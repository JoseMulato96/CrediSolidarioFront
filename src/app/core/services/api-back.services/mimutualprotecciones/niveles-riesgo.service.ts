import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class NivelesRiesgoService {
  url = `${environment.miMutualProteccionesUrl}/mimNivelRiesgo`;

  constructor(private readonly http: HttpClient) { }

  getNivelRiesgo(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getNivelesRiesgos(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
