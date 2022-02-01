import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MimProcesoMasivoService {

    url = `${environment.miMutualUtilidadesUrl}/mimProcesoMasivo`;

    constructor(private readonly http: HttpClient) {}

    getProcesosMasivo(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
