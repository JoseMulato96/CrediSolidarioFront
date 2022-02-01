import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  url = `${environment.miMutualProteccionesUrl}/mimGenero`;

  constructor(private readonly http: HttpClient) { }

  getGeneros(params: any): Observable<any> {
    return this.http.get(this.url, {params: params});
  }

}
