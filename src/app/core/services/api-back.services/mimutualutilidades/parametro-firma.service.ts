import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroFirmaService {

  url = `${environment.miMutualUtilidadesUrl}/mimParametroFirma`;

  constructor(private readonly http: HttpClient) { }

  obtenerFirma(codigo: string) {
    return this.http.get(`${this.url}/${codigo}`);
  }

  obtenerFirmas(params: any) {
    return this.http.get(this.url, { params: params });
  }

  guardarFirma(Firma: any) {
    return this.http.post(this.url, Firma);
  }

  actualizarFirma(codigo: string, Firma: any) {
    return this.http.put(`${this.url}/${codigo}`, Firma);
  }

  eliminarFirma(codigo: string) {
    return this.http.delete(`${this.url}/${codigo}`);
  }

}
