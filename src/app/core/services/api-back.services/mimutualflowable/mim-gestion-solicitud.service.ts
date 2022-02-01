import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimGestionSolicitudService {

  url = `${environment.miMutualFlowableUrl}/mimGestionSolicitud`;

  constructor(private readonly http: HttpClient) { }

  guardarGestionSolicitud(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

}
