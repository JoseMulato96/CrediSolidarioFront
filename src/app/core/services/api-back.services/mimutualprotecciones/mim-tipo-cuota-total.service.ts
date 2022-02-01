import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MimTipoCuotaTotalService {

  url = `${environment.miMutualProteccionesUrl}/mimTipoCuotaTotal`;

  constructor(private readonly http: HttpClient) { }

  getTipoCuotaTotal(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
