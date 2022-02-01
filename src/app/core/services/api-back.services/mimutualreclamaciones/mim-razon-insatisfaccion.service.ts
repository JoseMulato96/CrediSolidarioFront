import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimRazonInsatisfaccionService {
    url = `${environment.miMutualReclamacionesUrl}/mimRazonInsatisfaccion`;

    constructor(private readonly http: HttpClient) {}

    getRazonesInsatisfaccion(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
