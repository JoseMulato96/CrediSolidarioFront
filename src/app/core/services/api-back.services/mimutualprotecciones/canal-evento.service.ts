import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CanalEventoService {

    url = `${environment.miMutualProteccionesUrl}/mimCanalEvento`;

    constructor(private readonly http: HttpClient) {}

    getCanalesEvento(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }

}
