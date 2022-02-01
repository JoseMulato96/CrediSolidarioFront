import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CondicionActivacionService {

    url = `${environment.miMutualProteccionesUrl}/mimCondicionActivacion`;

    constructor(private readonly http: HttpClient) {}

    getCondicionActivacion(codigo: number): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }

    getCondicionesActivaciones(params: any): Observable<any> {
        return this.http.get(this.url, {params: params});
    }

    postCondicionesActivaciones(params: any): Observable<any> {
        return this.http.post(this.url, params);
    }

    putCondicionesActivaciones(codigo: number, params: any): Observable<any> {
        return this.http.put(`${this.url}/${codigo}`, params);
    }

    deleteCondicionesActivaciones(codigo: number): Observable<any> {
        return this.http.delete(`${this.url}/${codigo}`);
    }
}
