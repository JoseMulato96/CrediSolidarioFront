import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionAsignacionGestionDiariaService {

  url = environment.miMutualProteccionesUrl;

  constructor(private readonly http: HttpClient) { }

  getTipoAsginaciones(): Observable<any> {
    return this.http.get(`${this.url}/mimTipoAsignacion`);
  }

  guradarConfiguracionAsignacionGestionDiaria(object: any): Observable<any> {
    return this.http.post(`${this.url}/mimConfiguracionAsignacionGestionDiaria`, object);
  }

  editarConfiguracionAsignacionGestionDiaria(object: any, codigo: any): Observable<any> {
    return this.http.put(`${this.url}/mimConfiguracionAsignacionGestionDiaria/${codigo}`, object);
  }

  getConfiguracionAsignacionGestionDiaria(param: any): Observable<any> {
    return this.http.get(`${this.url}/mimConfiguracionAsignacionGestionDiaria`, { params: param });
  }

  eliminarConfiguracionAsignacionGestionDiaria(codigo): Observable<any> {
    return this.http.delete(`${this.url}/mimConfiguracionAsignacionGestionDiaria/${codigo}`);
  }

}
