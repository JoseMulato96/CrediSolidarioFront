import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  url = `${environment.miMutualFlowableUrl}/task`;

  constructor(private readonly http: HttpClient) { }

  obtenerTareas(params?: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  obtenerTarea(idTarea: string) {
    return this.http.get(`${this.url}/${idTarea}`);
  }

  reasignacionOrden(params: any): Observable<any> {
    return this.http.post(`${this.url}/assignee`, params);
  }

  realizarAsignacionDiaria(params: any): Observable<any> {
    return this.http.post(`${this.url}/assignee/diary`, params);
  }

  completarTarea(idTarea: string, params: any): Observable<any> {
    return this.http.post(`${this.url}/${idTarea}/complete`, params);
  }

  getRuntimeTask(params?: any): Observable<any> {
    return this.http.get(`${this.url}/runtime/tasks`, { params: params });
  }

}
