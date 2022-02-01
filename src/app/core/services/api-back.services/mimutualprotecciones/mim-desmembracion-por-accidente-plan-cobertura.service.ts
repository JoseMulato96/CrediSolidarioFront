import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimDesmembracionPorAccidentePlanCoberturaService {
    url = `${environment.miMutualProteccionesUrl}/mimDesmembracionPorAccidentePlanCobertura`;

    constructor(private readonly http: HttpClient) { }

    getDesmembracionPorAccidentePlanCobertura(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/codigo/${codigo}`);
    }

    getDesmembracionesPorAccidentePlanCobertura(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    putDesmembracionPorAccidentePlanCobertura(codigo: string, param: any): Observable<any> {
        return this.http.put(`${this.url}/${codigo}`, param);
    }

    postDesmembracionPorAccidentePlanCobertura(param: any): Observable<any> {
        return this.http.post(this.url, param);
    }

    deleteDesmembracionPorAccidentePlanCobertura(codigo: string): Observable<any> {
        return this.http.delete(`${this.url}/${codigo}`);
    }
}
