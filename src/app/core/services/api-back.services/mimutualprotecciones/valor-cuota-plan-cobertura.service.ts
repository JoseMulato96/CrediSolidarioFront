import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimValorCuotaPlanCoberturaService {
    url = `${environment.miMutualProteccionesUrl}/mimValorCuotaPlanCobertura`;

    constructor(private readonly http: HttpClient) { }

    getValorCuotaPlanCobertura(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/codigo/${codigo}`);
    }

    getValoresCuotaPlanCobertura(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    putValorCuotaPlanCobertura(codigo: string, param: any): Observable<any> {
        return this.http.put(`${this.url}/${codigo}`, param);
    }

    postValorCuotaPlanCobertura(param: any): Observable<any> {
        return this.http.post(this.url, param);
    }

    deleteValorCuotaPlanCobertura(codigo: string): Observable<any> {
        return this.http.delete(`${this.url}/${codigo}`);
    }
}
