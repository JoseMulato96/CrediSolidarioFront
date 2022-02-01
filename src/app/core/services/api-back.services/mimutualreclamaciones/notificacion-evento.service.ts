import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacionEventoService {

    url = `${environment.miMutualReclamacionesUrl}/mimNotificacionEvento`;

    constructor(private readonly http: HttpClient) {}

    postNotificarEvento(param: any): Observable<any> {
        return this.http.post(`${this.url}`, param);
    }

    getNotificacionesEvento(param: any): Observable<any> {
      return this.http.get(this.url, {params: param});
    }

}
