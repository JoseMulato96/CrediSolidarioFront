import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProteccionesEventosService {

    url = `${environment.miMutualAsociadosUrl}/sipProteccionesEventos`;

    constructor(private readonly http: HttpClient) {}

    getProteccionesEventos(param: any): Observable<any> {
        return this.http.get(`${this.url}`, {params: param});
    }

    getPortafolio(ruta: string, param: any): Observable<any> {
        return this.http.get(`${this.url}/${ruta}`, {params: param});
    }

}
