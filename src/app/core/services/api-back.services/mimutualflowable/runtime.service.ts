import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  url = `${environment.miMutualFlowableUrl}/runtime`;

  constructor(private readonly http: HttpClient) { }

  getRuntimeTasks(params?: any): Observable<any> {
    return this.http.get(`${this.url}/task`, { params: params });
  }

}
