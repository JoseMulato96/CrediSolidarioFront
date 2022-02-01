import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimRazonAnulacionService {
    url = `${environment.miMutualUtilidadesUrl}/mimRazonAnulacion`;

    constructor(private readonly http: HttpClient) {}

    getRazonesAnulacion(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
