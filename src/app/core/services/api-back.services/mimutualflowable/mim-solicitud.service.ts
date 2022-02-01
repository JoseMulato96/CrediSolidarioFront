import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimSolicitudService {

  private readonly url = `${environment.miMutualFlowableUrl}/mimSolicitud`;

  constructor(private readonly http: HttpClient) { }

  getMimSolicitud(params?: any): Observable<any> {
    return this.http.get(this.url, { params });
  }

}
