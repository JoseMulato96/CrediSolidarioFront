import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimTipoBeneficiarioServicioService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoBeneficiarioServicio`;

  constructor(private readonly http: HttpClient) { }

  obtenerTiposBeneficiariosServicio(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
