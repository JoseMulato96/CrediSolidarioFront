import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class MimEstadoCotizacionService {

    private readonly url = `${environment.miMutualAsociadosUrl}/mimEstadoCotizacion`;

    constructor(private readonly http: HttpClient) { }

    getEstadosContizacion(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }

}
