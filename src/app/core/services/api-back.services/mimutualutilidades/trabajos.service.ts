import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrabajosService {

    url = `${environment.miMutualUtilidadesUrl}/springBatch/jobs`;

    constructor(private readonly http: HttpClient) {}

    cargueTrabajo(nombreTrabajo: string, param: any): Observable<any> {
        return this.http.post(`${this.url}/${nombreTrabajo}/bulkLoading`, param);
    }

    getTrabajos(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }

}
