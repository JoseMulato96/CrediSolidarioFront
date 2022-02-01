import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActIndFechaNacimientoService {
  constructor(private readonly http: HttpClient) {}

  /**
   *
   * @description Actualiza indicador de fecha de nacimiento
   * @param asoNumInt Identificador unico de asociado.
   * @param peticion Parametros de la actualizacion
   */
  actualizarIndicadorFechaNacimiento(param: any) {
    const url = `${environment.miMutualAsociadosUrl}/sipVinculaciones/indicador/fechaNacimiento`;
    return this.http.put(url, param);
  }
}
