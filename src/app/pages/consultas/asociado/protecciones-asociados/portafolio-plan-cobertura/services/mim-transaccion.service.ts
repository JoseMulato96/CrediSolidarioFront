import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MimTransaccionService {

  private readonly url = `${environment.miMutualAsociadosUrl}/mimTransaccion`;

  constructor(private readonly http: HttpClient) { }

  getTransacciones(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }
}
