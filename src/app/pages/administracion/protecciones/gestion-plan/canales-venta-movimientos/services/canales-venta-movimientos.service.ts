import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class CanalesVentaMovimientosService {

  url = `${environment.miMutualProteccionesUrl}/mimPlanCanalVenta`;

  constructor(private readonly http: HttpClient) { }
  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta registros por código
   * @param codigo Código del fondo
   */
  getCanalVentaMovimiento(codigoPlan: string, codigoCanalVenta: string): Observable<any> {
    return this.http.get(`${this.url}/codigoPlan/${codigoPlan}/codigoCanalVenta/${codigoCanalVenta}`);
  }

  /**
   * Autor: Cesar Millan
   * Función: Servicio que consulta todos los registros
   * @param
   */
  getCanalesVentasMovimientos(params: any): Observable<any> {
    return this.http.get(this.url, { params: params });
  }

  /**
   * Autor: Cesar Millan
   * Función: Actualizar registro
   * @param codigo Código del plan
   * @param param Objeto del canal de venta
   */
  putCanalVentaMovimiento(codigoPlan: string, codigoCanalVenta: string, param: any): Observable<any> {
    return this.http.put(`${this.url}/codigoPlan/${codigoPlan}/codigoCanalVenta/${codigoCanalVenta}`, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Guardar registro
   * @param param Objeto de parametros
   */
  postCanalVentaMovimiento(param: any): Observable<any> {
    return this.http.post(this.url, param);
  }

  /**
   * Autor: Cesar Millan
   * Función: Eliminar registro
   * @param codigo
   */
  deleteCanalVentaMovimiento(codigoPlan: string, codigoCanalVenta: string): Observable<any> {
    return this.http.delete(`${this.url}/codigoPlan/${codigoPlan}/codigoCanalVenta/${codigoCanalVenta}`);
  }

}
