import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamoPorService {
    url = `${environment.miMutualReclamacionesUrl}/mimReclamoPor`;
    constructor(private readonly http: HttpClient) {}

    getReclamoPor(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
