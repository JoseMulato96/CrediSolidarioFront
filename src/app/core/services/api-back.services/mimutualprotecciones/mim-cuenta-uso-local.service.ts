import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimCuentaUsoLocalService {

  url = `${environment.miMutualProteccionesUrl}/mimUsosLocal`;

  constructor(private readonly http: HttpClient) { }

  getCuentaUsoLocales(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

  postCuentaUsoLocal(params: any): Observable<any> {
    return this.http.post(this.url, params);
  }

  putCuentaUsoLocal(codigo: string, params: any): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, params);
  }

}
