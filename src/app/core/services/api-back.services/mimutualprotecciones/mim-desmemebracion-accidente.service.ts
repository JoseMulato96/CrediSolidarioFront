import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimDesmembracionPorAccidenteService {
    private readonly url = `${environment.miMutualProteccionesUrl}/mimDesmembracionPorAccidente`;

    constructor(private readonly http: HttpClient) { }

    getDesmembracionPorAccidental(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
      }

    getDesmembracionPorAccidentes(params: any): Observable<any> {
        return this.http.get(this.url, { params });
    }

    postDesmembracionPorAccidente(params: any): Observable<any> {
        return this.http.post(this.url, params);
    }

    putDesmembracionPorAccidente(codigo: string, params: any): Observable<any> {
        return this.http.put(`${this.url}/${codigo}`, params);
    }

    deleteDesmembracionPorAccidente(codigo: string): Observable<any> {
        return this.http.delete(`${this.url}/${codigo}`);
    }
}
