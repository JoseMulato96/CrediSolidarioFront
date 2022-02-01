import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MimEstructuraCargueService {

  url = `${environment.miMutualProteccionesUrl}/mimEstructuraCargue`;

  constructor(private readonly http: HttpClient) { }

  getEstructuras(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }
}
