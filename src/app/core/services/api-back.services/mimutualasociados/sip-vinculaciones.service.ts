import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SipVinculacionesService {

  private readonly url = `${environment.miMutualAsociadosUrl}/sipVinculaciones`;

  constructor(private readonly http: HttpClient) { }

  getSipVinculaciones(param: any): Observable<any> {
      return this.http.get(this.url, {params: param});
  }

}
