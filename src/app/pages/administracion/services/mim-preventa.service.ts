import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class MimPreventaService {

    private readonly url = `${environment.miMutualAsociadosUrl}/mimPreventa`;

    constructor(private readonly http: HttpClient) { }

    getMimPreventa(params: any): Observable<any> {
        return this.http.get(this.url, {params});
    }

    postMimPreventaRechazarCargue(params: any): Observable<any> {
        return this.http.post(`${this.url}/rechazarCargue`, params);
    }

    postMimPreventaRechazarCargueDetalle(params: any): Observable<any> {
        return this.http.post(`${this.url}/rechazarCargueDetalle`, params);
    }

    postMimPreventaAplicarRegistros(params: any): Observable<any> {
        return this.http.post(`${this.url}/aplicarRegistros`, params);
    }
}
