import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroCartaService {

  url = `${environment.miMutualUtilidadesUrl}/mimParametroCarta`;

  constructor(private readonly http: HttpClient) { }

  obtenerCarta(codigo: string) {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerCartas(params: any) {
    return this.http.get(this.url, { params: params });
  }

  guardarCarta(carta: any) {
    return this.http.post(this.url, carta);
  }

  actualizarCarta(codigo: string, carta: any) {
    return this.http.put(`${this.url}/${codigo}`, carta);
  }

  eliminarCarta(codigo: string) {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
