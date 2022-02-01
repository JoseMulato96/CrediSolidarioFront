
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoTipoBeneficiarioPagoService {

  constructor(private readonly http: HttpClient) { }

  obtenerEventoTipoBeneficiarioPago(param: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimEventoBeneficiarioPago`;
    return this.http.get(url, {params: param});
  }
}
