import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OficinasService {

  url = `${environment.miMutualIntegracionesUrl}/seguridad/pltagcori`;

  constructor(private readonly http: HttpClient) { }

  getOficina(agCori: string, codEmp: number): Observable<any> {
    const url = `${this.url}/agCori/${agCori}/codEmp/${codEmp}`;
    return this.http.get(url);
  }

  getOficinas(params: any): Observable<any> {
   const url = `${this.url}/codEmp/67890`;
    return this.http.get(url, {params: params});
  }
}
