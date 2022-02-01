import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionDiariaService {

    url = `${environment.miMutualFlowableUrl}/task/runtime/historic/tasks`;

    constructor(private readonly http: HttpClient) {}

    getGestionDiaria(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
