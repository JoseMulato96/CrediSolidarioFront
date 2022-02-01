import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimColorimetriaRangoService {
    url = `${environment.miMutualUtilidadesUrl}/mimColorimetriaRango?codigoTipoColorimetria=1`;

    constructor(private readonly http: HttpClient) {}

    getColorimetria(): Observable<any> {
        return this.http.get(this.url);
    }
}
