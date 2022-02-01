import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class PresentacionValorPortafolioService {

    url = `${environment.miMutualProteccionesUrl}/mimPresentacionPortafolio`;

    constructor(private readonly http: HttpClient) { }

    getPresentacionesValorPortafolio(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    getPresentacionValorPortafolio(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }


}
