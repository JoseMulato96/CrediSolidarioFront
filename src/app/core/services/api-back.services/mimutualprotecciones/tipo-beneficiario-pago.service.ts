
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoBeneficiarioPagoService {
  constructor(private readonly http: HttpClient) { }

  obtenerTipoBeneficiarioPago(param: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimTipoBeneficiarioPago`;
    return this.http.get(url, {params: param});
  }
}
