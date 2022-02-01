import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoTopeService {

    url = `${environment.miMutualProteccionesUrl}/mimTipoTope`;

    constructor(private readonly http: HttpClient) { }

    getTipoTopes(): Observable<any> {
        return this.http.get(this.url);
    }

    getTiposTopes(params: any): Observable<any> {
        return this.http.get(this.url, {params: params});
      }

    getTipoTope(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }
}
