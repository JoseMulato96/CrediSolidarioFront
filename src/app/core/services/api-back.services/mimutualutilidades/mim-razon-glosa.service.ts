import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimRazonGlosaService {
    private readonly url = `${environment.miMutualUtilidadesUrl}/mimRazonGlosa`;

    constructor(private readonly http: HttpClient) { }

    getRazonGlosa(param: any): Observable<any> {
        return this.http.get(this.url, { params: param });
    }
}
