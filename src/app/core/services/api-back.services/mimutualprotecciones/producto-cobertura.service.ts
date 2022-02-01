import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimProductoCoberturaService {

  url = `${environment.miMutualProteccionesUrl}/mimProductoCobertura`;

  constructor(private readonly http: HttpClient) { }

  obtenerMimProductoCoberturaByPlanCobertura(codigoPlanCobertura: any): Observable<any> {
    return this.http.get(`${this.url}/${codigoPlanCobertura}`);
  }

}
