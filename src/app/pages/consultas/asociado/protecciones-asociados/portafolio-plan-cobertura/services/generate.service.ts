import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class GenerateService {

  private readonly url = `${environment.miMutualUtilidadesUrl}/generate`;

  constructor(private readonly http: HttpClient) { }

  postGenerarPDF(params: any, tipoPDF: string): Observable<HttpResponse<any>> {
    return this.http.post<Blob>(
      `${this.url}/jasper/pdf/${tipoPDF}`, params, {
      observe: 'response',
      responseType: 'blob' as 'json'
    }
    );
  }
}
