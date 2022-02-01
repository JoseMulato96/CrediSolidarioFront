import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimProcesoLogService {

    url = `${environment.miMutualUtilidadesUrl}/mimProcesoLog`;

    constructor(private readonly http: HttpClient) {}

    descargarLog(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
