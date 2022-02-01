import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MimSubestadoService {

  url = `${environment.miMutualFlowableUrl}/mimSubestado`;

  constructor(private readonly http: HttpClient) { }

  getSubEstados(param: any): Observable<any> {
    return this.http.get(this.url, { params: param });
  }

}
