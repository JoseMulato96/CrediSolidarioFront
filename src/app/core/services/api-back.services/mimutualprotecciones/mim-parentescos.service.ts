import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MimParentescosService {

  url = `${environment.miMutualProteccionesUrl}/mimParentesco`;

  constructor(private readonly http: HttpClient) { }

  getParentesco(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
