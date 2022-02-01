
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecaudosFacturacionAsociados } from '@shared/models/recaudos-facturacion-asociados.model';
import { IPage, Page } from '@shared/interfaces/page.interface';
import { RecaudosFacturacionAsociadosDetalle } from '@shared/models/recaudos-facturacion-asociados-detalle.model';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable()
export class RecaudosFacturacionAsociadosService {

  constructor(private readonly http: HttpClient) { }

  /**
   *
   * @description Obtiene los recaudos de facturacion de asociados.
   * @param options Parametros de la consulta.
   */
  getRecaudosFacturacionAsociados(options: any): Observable<IPage<RecaudosFacturacionAsociados>> {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_recaudos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_recaudos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_recaudos.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_facturacion_recaudos.observacion
    };

    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${options.asoNumInt}/facturacion/recaudos?tipoParametro=2&page=${options.page}&size=${options.size}`;
    return this.http.get<IPage<RecaudosFacturacionAsociados>>(url, { headers: jsonHeaders });
  }

  /**
   *
   * @description Obtiene el detalle del recaudo seleccionado.
   * @param options Parametros de la consulta.
   */
  getRecaudosFacturacionAsociadosDetalle(options: any): Observable<Page<RecaudosFacturacionAsociadosDetalle>> {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${options.asoNumInt}/facturacion/recaudos/detalle?consecutivo=${options.consecutivo}&page=${options.page}&size=${options.size}`;
    return this.http.get<IPage<RecaudosFacturacionAsociadosDetalle>>(url);
  }

}
