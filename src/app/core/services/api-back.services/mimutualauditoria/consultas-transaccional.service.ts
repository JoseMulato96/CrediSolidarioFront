import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ConsultasTransaccionalService {
  store: any;
  constructor(
    private readonly http: HttpClient
  ) { }

  getStore() {
    return this.store;
  }

  /**
   * @description Obtiene listado de funcionalidades.
   * @author Cesar Millan
   * @param codigo Código de funcionalidad
   */
  getNombreFuncionalidades(codigo: string) {

    return this.http.get<Observable<any>>(
      `${environment.miMutualAuditoriaUrl}/sipNombreFuncionalidad/buscar?codigo=${codigo}`
    );
  }

  generarExcel(email: string, datos: any): Observable<HttpResponse<any>> {
    datos.email = email;
    const url = `${environment.miMutualAuditoriaUrl}/sipLogTransaccional/buscar`;
    return this.http.get<any>(url, {
      observe: 'response',
      params: datos,
      responseType: 'blob' as 'json'
    });
  }
  /**
   * @author Edwar Ferney Murillo Arboleda
   * @description Guarda un objeto en el log transaccional
   * @param datos
   */
  guardarLogTransaccional(datos: any) {
    const url = `${environment.miMutualAuditoriaUrl}/sipLogTransaccional`;
    return this.http.post(url, datos);
  }
}
