import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MimRazonNegacionService {

    url = `${environment.miMutualReclamacionesUrl}/mimRazonNegacion`;

    constructor(private readonly http: HttpClient) {}

    getRazonesNegacion(param: any) {
        return this.http.get(this.url, {params: param});
    }
}
