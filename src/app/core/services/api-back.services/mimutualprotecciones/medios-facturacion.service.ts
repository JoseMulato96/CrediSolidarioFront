import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MediosFacturacionService {

  url = `${environment.miMutualProteccionesUrl}/mimMedioFacturacion`;

  constructor(private readonly http: HttpClient) { }

  listarMediosFacturacion(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
