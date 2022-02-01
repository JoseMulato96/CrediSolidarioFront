import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimRolesFlujoService {

  url = `${environment.miMutualFlowableUrl}/mimRolesFlujo`;

  constructor(private readonly http: HttpClient) { }

  obtenerRolesFlujo(params: any): Observable<any> {
    let uri = `${this.url}?`;
    for (const [key, value] of Object.entries(params)) {
      uri += `${key}=${value}&`;
    }

    return this.http.get(uri);
  }
}
