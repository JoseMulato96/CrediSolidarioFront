import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SipPreguntasService {

  private readonly url = `${environment.miMutualUtilidadesUrl}/sipPreguntas`;

  constructor(private readonly http: HttpClient) { }

  getPreguntas(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }
}
