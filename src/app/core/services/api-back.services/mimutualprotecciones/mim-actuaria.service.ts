import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimActuariaService {

  private readonly url = `${environment.miMutualProteccionesUrl}`;
  estadosCard: IEstadosCard;

  constructor(private readonly http: HttpClient) { }

  getConceptosDistribucion(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

  postConceptosDistribucion(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }

  putConceptosDistribucion(params: any): Observable<any> {
    return this.http.put(this.url, params);
  }

  setEstadosCard(estadosCard: IEstadosCard) {
    this.estadosCard = estadosCard;
  }

  getEstadosCard() {
      return this.estadosCard;
  }

}

export interface IEstadosCard {
  distribuciones: boolean;
  factores: boolean;
  factoresBobertura: boolean;
}
