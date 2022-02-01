import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimTipoSolicitudService {

  private readonly url = `${environment.miMutualFlowableUrl}/mimTipoSolicitud`;

  constructor(private readonly http: HttpClient) { }

  getMimTipoSolicitud(params?: any): Observable<any> {
    return this.http.get(this.url, { params });
  }

}
