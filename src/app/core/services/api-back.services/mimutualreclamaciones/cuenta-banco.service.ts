import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaBancoService {

    urlBanco = `${environment.miMutualReclamacionesUrl}/mimBanco`;
    urlCuenta = `${environment.miMutualReclamacionesUrl}/mimTipoCuentaBanco`;

    constructor(private readonly http: HttpClient) {}

    getBancos(param: any): Observable<any> {
        return this.http.get(this.urlBanco, {params: param});
    }

    getTipoCuenta(param: any): Observable<any> {
        return this.http.get(this.urlCuenta, {params: param});
    }

}
