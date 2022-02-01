import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MimCargueSolicitudService {

  url = `${environment.miMutualUtilidadesUrl}/mimCargueSolicitud`;

  constructor(private readonly http: HttpClient) {}

  descargarDetalleTrabajo(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }

}
