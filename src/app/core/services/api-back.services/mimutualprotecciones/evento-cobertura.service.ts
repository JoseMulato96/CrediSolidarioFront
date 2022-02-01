import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventoCoberturaService {

    url = `${environment.miMutualProteccionesUrl}/mimEventoPlanCobertura`;

    constructor(private readonly http: HttpClient) {}

    getEventosCobertura(param: any): Observable<any> {
        return this.http.get(`${this.url}/portafolio`, {params: param});
    }

}
