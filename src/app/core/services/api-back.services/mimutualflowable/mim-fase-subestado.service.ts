import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimFaseSubestadoService {
    url =  `${environment.miMutualFlowableUrl}/mimFaseSubestado`;
    constructor(private readonly http: HttpClient) {}

    getFasesSubestados(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
