import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimLiquidacionService {

  url = `${environment.miMutualReclamacionesUrl}/mimLiquidacion`;

  constructor(private readonly http: HttpClient) { }

  getLiquidacionEvento(codigo: string): Observable<any> {
    return this.http.get(`${this.url}/${codigo}`);
  }

  getLiquidacionesEvento(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }

  postLiquidacionEvento(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  postSimularLiquidacionEvento(param: any): Observable<any> {
    return this.http.post(`${this.url}/simular`, param);
  }

  putLiquidacionEvento(codigo: string, param: string): Observable<any> {
    return this.http.put(`${this.url}/${codigo}`, param);
  }

}
