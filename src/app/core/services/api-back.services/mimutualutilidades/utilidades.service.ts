import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ReportParams } from '@shared/models/report-params.model';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private readonly http: HttpClient) { }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description exporta excel con base a los datos entregados
   */
  exportarExcel(nombre: string, datos: any): Observable<HttpResponse<Blob>> {
    return this.http.post<Blob>(
      `${environment.miMutualUtilidadesUrl}/excel/export?nombre=${nombre}`,
      datos,
      {
        observe: 'response',
        responseType: 'blob' as 'json'
      }
    );
  }

  exportarExcel2(nombre: string, datos: any): Observable<HttpResponse<Blob>> {
    return this.http.post<Blob>(
      `${environment.miMutualUtilidadesUrl}/excel/v2/export?nombre=${nombre}`,
      datos,
      {
        observe: 'response',
        responseType: 'blob' as 'json'
      }
    );
  }

  generarJasper(formato: string, nombre: string, datos: ReportParams): Observable<HttpResponse<any>>  {
    return this.http.post<Blob>(
      `${environment.miMutualUtilidadesUrl}/generate/jasper/${formato}/${nombre}`, datos, {
        observe: 'response',
        responseType: 'blob' as 'json'
      }
    );
  }
}
