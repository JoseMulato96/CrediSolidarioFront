import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  url = `${environment.miMutualUtilidadesUrl}/logs/download?file=${environment.pathFiles}`;
  urlConvertDoocument = `${environment.miMutualUtilidadesUrl}/csv/excel`;

  constructor(private readonly http: HttpClient) { }

  getDocumento(param: string): Observable<any> {
    return this.http.get(this.url + param);
  }

  descargarDocumentoFTP(archivo: string): Observable<HttpResponse<any>> {
    console.log("documento formato", archivo);
    return this.http.get<Blob>(this.url + archivo, {
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }

  postConvertDocument(param: any): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(this.urlConvertDoocument, param, {
      observe: 'response',
      responseType: 'blob' as 'json'
    });
  }
}
