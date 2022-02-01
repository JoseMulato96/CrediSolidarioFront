import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimProyectoVidaService {

  private readonly url = `${environment.miMutualProteccionesUrl}/mimProyectoVida`;

  constructor(private readonly http: HttpClient) { }

  getProyectosVida(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }
}
