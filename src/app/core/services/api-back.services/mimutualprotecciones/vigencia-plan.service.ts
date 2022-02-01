import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VigenciaPlanService {

    url = `${environment.miMutualProteccionesUrl}/mimVigenciaPlan`;

    constructor(private readonly http: HttpClient) { }

    getVigenciasPlan(): Observable<any> {
        return this.http.get(this.url);
    }

    getVigenciasPlanes(params: any): Observable<any> {
        return this.http.get(this.url, {params: params});
      }

    getVigenciaPlan(codigo: string): Observable<any> {
        return this.http.get(`${this.url}/${codigo}`);
    }


}
