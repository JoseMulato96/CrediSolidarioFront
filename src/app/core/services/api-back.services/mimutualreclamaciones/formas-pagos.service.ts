import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormasPagoService {

    url = `${environment.miMutualReclamacionesUrl}/mimFormaPago`;

    constructor(private readonly http: HttpClient) { }

    getFormasPago(params?: any): Observable<any> {
        return this.http.get(this.url, {params: params});
    }

}
