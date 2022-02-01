import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimFasesService {

    url = `${environment.miMutualFlowableUrl}/mimRolLiderFlujo`;
    urlFlujo = `${environment.miMutualFlowableUrl}/mimRolesFlujo`;

    constructor(private readonly http: HttpClient) {}

    getFases(param: any): Observable<any> {
        return this.http.get(this.url, {params:  param});
    }

    getRolesFlujo(param: any): Observable<any> {
        return this.http.get(this.urlFlujo, {params:  param});
    }
}
