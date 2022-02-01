import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MimTipoProcesoMasivoService {
    url = `${environment.miMutualUtilidadesUrl}/mimTipoProcesoMasivo`;

    constructor(private readonly http: HttpClient) {}

    getTipoProcesosMasivo(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
