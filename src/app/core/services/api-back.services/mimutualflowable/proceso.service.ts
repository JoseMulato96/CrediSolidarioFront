import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  url = `${environment.miMutualFlowableUrl}/process`;

  constructor(private readonly http: HttpClient) { }

  iniciarProceso(nombreProceso: string, params: any): Observable<any> {
    return this.http.post(`${this.url}/${nombreProceso}`, params);
  }

  getObservacionesByIdProceso(idProceso: string, params?: any): Observable<any> {
    return this.http.get(`${this.url}/${idProceso}/comments`, { params: params });
  }

  getTareasPorIdProceso(idProceso: string, params?: any): Observable<any> {
    return this.http.get(`${this.url}/${idProceso}/task` , {params: params} );
  }

  suspenderProceso(idProceso: string, param: any): Observable<any> {
    return this.http.post(`${this.url}/${idProceso}/suspend`, param);
  }

  activarProceso(idProceso: string, param: any): Observable<any> {
    return this.http.post(`${this.url}/${idProceso}/activate`, param);
  }

  guardarComentariosTarea(idProceso: string, idTarea: string, params: any): Observable<any> {
    return this.http.post(`${this.url}/${idProceso}/task/${idTarea}/comment`, params);
  }

  guardarComentario(idProceso: string, params: any): Observable<any> {
    return this.http.post(`${this.url}/${idProceso}/comment`, params);
  }

  getProcesoPadrePorIdSubproceso(idSubproceso: string): Observable<any> {
    return this.http.get(`${this.url}/parent-process/${idSubproceso}`);
  }

}
