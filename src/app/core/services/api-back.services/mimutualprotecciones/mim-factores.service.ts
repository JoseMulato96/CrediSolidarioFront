import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimFactoresService {

  url = `${environment.miMutualProteccionesUrl}/mimCargueFactores`;

  constructor(private readonly http: HttpClient) { }

  cargueFactores(tipoFactor: string, param: any): Observable<any> {
    return this.http.post(`${this.url}/${tipoFactor}`, param);
  }

  postCargueTipoFactor(factor: string, params: any): Observable<any> {
    return this.http.post(`${this.url}/${factor}`, params);
  }

}
