import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticosService {

  constructor(public http: HttpClient) {}

  /**
   * @description Obtiene diagnosticos
   *
   * @param texto Texto a buscar.
   */
  getDiagnosticos(texto: string) {
    const url = `${environment.miMutualUtilidadesUrl}/sipDiagnosticos/autocomplete?texto=${texto}`;
    return this.http.get(url);
  }
}
