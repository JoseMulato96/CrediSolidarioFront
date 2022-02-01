import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {
  url = `${environment.miMutualReglasUrl}/validaciones`;
  constructor(private readonly http: HttpClient) { }

  postValidaciones(params: any): Observable<any> {
     return this.http.post(this.url, params);
  }
}
