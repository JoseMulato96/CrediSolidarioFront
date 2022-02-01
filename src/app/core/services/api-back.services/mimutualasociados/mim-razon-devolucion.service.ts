import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MimRazonDevolucionService {

    url = `${environment.miMutualAsociadosUrl}/mimRazonDevolucion`;

    constructor(private readonly http: HttpClient) {}

    getRazonesDevolucion(param: any) {
        return this.http.get(this.url, {params: param});
    }
}
