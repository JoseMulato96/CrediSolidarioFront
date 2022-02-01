import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParametrosConfiguracionOperacionesService {

  url = `${environment.miMutualProteccionesUrl}`;

  constructor(private readonly http: HttpClient) { }

  getParametrosConfiguracionOperaciones(params: any): Observable<any> {
    return this.http.get(`${this.url}/mimConfiguracionMovimiento`, { params: params });
  }

  deleteParametrosConfiguracionOperaciones(codigo: any): Observable<any> {
    return this.http.delete(`${this.url}/mimConfiguracionMovimiento/${codigo}`);
  }

  getCiclosFacturacion(): Observable<any> {
    return this.http.get(`${this.url}/mimCicloFacturacion`);
  }

  getTipoGeolocalizacion(): Observable<any> {
    return this.http.get(`${this.url}/mimTipoGeolocalizacion`);
  }

  getTipoMovimiento(): Observable<any> {
    return this.http.get(`${this.url}/mimTipoCantidadCasosMov`);
  }

  guardarDetalleConfiguracion(params: any): Observable<any> {
    return this.http.post(`${this.url}/mimConfiguracionMovimiento`, params);
  }

  agregarGeolocalizacion(params: any): Observable<any> {
    return this.http.post(`${this.url}/mimConfiguracionMovDetalle`, params);
  }

  actualizarGeolocalizacion(params: any, codigo: any): Observable<any> {
    return this.http.put(`${this.url}/mimConfiguracionMovDetalle/${codigo}`, params);
  }

  eliminarGeolocalizacion(codigo: any): Observable<any> {
    return this.http.delete(`${this.url}/mimConfiguracionMovDetalle/${codigo}`);
  }

  editarDetalleConfiguracion(params: any, codigo: any): Observable<any> {
    return this.http.put(`${this.url}/mimConfiguracionMovimiento/${codigo}`, params, codigo);
  }

}
