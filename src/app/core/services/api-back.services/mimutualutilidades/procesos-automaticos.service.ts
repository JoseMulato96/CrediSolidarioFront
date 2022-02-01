import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesosAutomaticosService {

  url = `${environment.miMutualUtilidadesUrl}/quartz/jobs`;
  urlTipoMovimientos = `${environment.miMutualUtilidadesUrl}/mimProcesoAutomatico`;
  urlParametrosProcesosAutomaticos = `${environment.miMutualUtilidadesUrl}/mimParametrosProcesoAutomatico`;


  constructor(private readonly http: HttpClient) { }

  postProcesosAutomaticos(param: any): Observable<any> {
    return this.http.post(`${this.url}/schedule`, param);
  }

  getTiposMovimientos(params?: any): Observable<any> {
    return this.http.get(this.urlTipoMovimientos, { params: params });
  }

  putProcesosAutomaticos(jobName: string, jobGroup: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/jobName/${jobName}/jobGroup/${jobGroup}`, param);
  }

  getProcesoAutomatico(nombreJob: string, grupoJob: string): Observable<any> {
    return this.http.get(`${this.url}/jobName/${nombreJob}/jobGroup/${grupoJob}`);
  }

  getProcesosAutomaticos(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  deleteProcesoAutomatico(jobName: string, jobGroup: string): Observable<any> {
    return this.http.delete(`${this.url}/jobName/${jobName}/jobGroup/${jobGroup}`);
  }

  iniciarProcesoAutomatico(params: any): Observable<any> {
    return this.http.post(`${this.url}/launch`, params);
  }

  obtenerParametrosProcesoAutomatico(params): Observable<any> {
    return this.http.get(this.urlParametrosProcesosAutomaticos, { params: params });
  }

  pausarProcesoAutomatico(params: any): Observable<any> {
    return this.http.post(`${this.url}/pause`, params);
  }

  reactivarProcesoAutomatico(params: any): Observable<any> {
    return this.http.post(`${this.url}/resume`, params);
  }

  detenerProcesoAutomatico(params: any): Observable<any> {
    return this.http.post(`${this.url}/stop`, params);
  }

}
