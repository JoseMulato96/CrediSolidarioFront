import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CargueMasivoService {

  url = `${environment.miMutualReclamacionesUrl}/mimCopago`;
  utlCargueMasivo = environment.miMutualReclamacionesUrl;

  constructor(private readonly http: HttpClient) { }

  postCargueMasivo(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  postCargue(codigoEvento: string, param: any): Observable<any> {
    return this.http.post(`${this.utlCargueMasivo}/${codigoEvento}/cargueMasivo`, param);
  }
}
