import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable()
export class CalculoProyeccionesService {

  private readonly url = `${environment.miMutualAsociadosUrl}/calculo/proyecciones`;

  constructor(private readonly http: HttpClient) { }

  getCalculoProyeccion(codigo: any): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  postCalculoProyeccion(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }
}
