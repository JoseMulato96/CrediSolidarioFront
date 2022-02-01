import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacMoraService {

  url = `${environment.miMutualAsociadosUrl}/asociados`;

  constructor(private readonly http: HttpClient) { }

  getCotizaciones(param: any): Observable<any> {
    return this.http.get(this.url, { params: param });
  }

  getFacMora(asoNumint: any): Observable<any> {
    return this.http.get(`${this.url}/${asoNumint}/mora/buscar`);
  }

}
