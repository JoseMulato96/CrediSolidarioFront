import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimPreguntasService {

  private readonly url = `${environment.miMutualUtilidadesUrl}/mimPreguntas`;

  constructor(private readonly http: HttpClient) { }

  getMimPreguntas(params: any): Observable<any> {
    return this.http.get(this.url, {params});
  }
}
