import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValorDevolverService {

  constructor(private readonly http: HttpClient) { }

  obtenerValoresDevolver(docAsociado: any, auxilio: any, estado: any): Observable<any> {
    return this.http.get<Observable<any>>(
      `${environment.miMutualAsociadosUrl}/asociados/${docAsociado}/protecciones/auxilio/${auxilio}?estados=${estado}`
    );
  }

  obtenerDetalleValoresDevolver(params: any, param: any): Observable<any> {
    return this.http.get<Observable<any>>(
      `${environment.miMutualIntegracionesUrl}/valoresRescate/${params}/${param}`
    );
  }
}
