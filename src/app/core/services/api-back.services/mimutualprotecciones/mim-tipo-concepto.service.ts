import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimTipoConceptoService {

    url = `${environment.miMutualProteccionesUrl}/mimTipoConcepto`;

    constructor(private readonly http: HttpClient) { }

    getTipoTopes(): Observable<any> {
        return this.http.get(this.url);
    }

    getTiposConceptos(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
      }

    getTiposConceptosParam(params: any): Observable<any> {
        return this.http.get(this.url, { params: params });
    }

    getTipoConcepto(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }
}
