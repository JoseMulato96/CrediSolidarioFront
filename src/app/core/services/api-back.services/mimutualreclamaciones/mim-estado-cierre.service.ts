import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MimEstadoCierreService {
    url = `${environment.miMutualReclamacionesUrl}/mimEstadoCierre`;

    constructor(private readonly http: HttpClient) {}

    getEstadosCierre(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
