import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class MovimientoPlanCanalService {
    private readonly url = `${environment.miMutualProteccionesUrl}/mimMovimientoPlanCanal`;

    constructor(private readonly http: HttpClient) { }

    getMimMovimientoPlanCanal(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }

}
