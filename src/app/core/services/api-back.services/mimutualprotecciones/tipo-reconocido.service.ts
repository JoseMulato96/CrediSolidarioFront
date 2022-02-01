import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TipoReconocidoService {

    url = `${environment.miMutualProteccionesUrl}/mimTipoReconocido`;

    constructor(private readonly http: HttpClient) { }

    getTipoReconocidos(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    getTipoReconocido(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }


}
