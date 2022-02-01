import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CoberturasService {
  constructor(private readonly http: HttpClient) { }

  obtenerCobertura(codigo: string): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura/${codigo}`;
    return this.http.get(url);
  }

  obtenerCoberturas(params: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura`;
    return this.http.get(url, { params: params });
  }

  guardarCobertura(cobertura: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura`;
    return this.http.post(url, cobertura);
  }

  actualizarCobertura(codigo: string, cobertura: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura/${codigo}`;
    return this.http.put(url, cobertura);
  }

  eliminarCobertura(codigo: string): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura/${codigo}`;
    return this.http.delete(url);
  }

  actualizarMimBeneficarioCobertura(codigo: string, coberturaBeneficairio: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura/${codigo}`;
    return this.http.patch(url, coberturaBeneficairio);
  }

  actualizarEstadoCobertura(codigo: string, estado: any) {
    const url = `${environment.miMutualProteccionesUrl}/mimCobertura/${codigo}/estado`;
    return this.http.put(url, estado);
  }

}
