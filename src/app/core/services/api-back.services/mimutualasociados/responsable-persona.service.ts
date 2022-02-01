import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponsablePersonaService {

    url = `${environment.miMutualAsociadosUrl}/mimResponsablePersona`;

    constructor(private readonly http: HttpClient) {}

    getResponsablePersonas(param: any): Observable<any> {
        return this.http.get(`${this.url}`, {params: param});
    }

}