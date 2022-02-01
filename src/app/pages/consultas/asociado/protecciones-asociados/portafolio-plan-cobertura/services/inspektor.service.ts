import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InspektorService {

  private readonly url = `${environment.miMutualIntegracionesUrl}/inspektor`;

  constructor(private readonly http: HttpClient) { }

  getInspektor(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }
}
