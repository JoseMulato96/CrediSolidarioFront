import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimTipoTransaccionCuentaContableService {

  url = `${environment.miMutualProteccionesUrl}/mimTransaccionCuentaContable`;

  constructor(private readonly http: HttpClient) { }

  get(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }

}
