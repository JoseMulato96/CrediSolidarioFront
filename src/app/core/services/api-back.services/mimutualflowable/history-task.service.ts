import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class HistoryTaskService {

  url = `${environment.miMutualFlowableUrl}/history/task`;

  constructor(private readonly http: HttpClient) { }

  getHistoryTasks(params?: any): Observable<any> {
    return this.http.get(`${this.url}`, { params: params });
  }

  getUsersHistoryTask(idProceso: string): Observable<any> {
    return this.http.get(`${this.url}/users/${idProceso}`);
  }

}
