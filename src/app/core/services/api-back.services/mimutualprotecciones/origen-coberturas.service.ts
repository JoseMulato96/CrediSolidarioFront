import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrigenCoberturasService {
  constructor(private readonly http: HttpClient) { }

  obtenerOrigenCoberturas(params: any): Observable<any> {
    const url = `${environment.miMutualProteccionesUrl}/mimOrigenCobertura`;
    return this.http.get(url, { params: params });
  }
}
