import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IPage } from '@shared/interfaces/page.interface';
import {
  FacturacionProteccion
} from '@shared/models/facturacion-protecciones.model';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class PortafolioAsociadosDetalleService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene el portafolio con el detalle
   * @return Subscripcion
   * @param asoNumInt Identificador unico de asociado.
   * @param consecutivo Consecutivo del detalle
   */
  getPortafolioDetalle(asoNumInt: string, consecutivo: number) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/protecciones/eventos/detalle?codAfirmacion=${
      SERVICIOS_PARAMETROS.portafolio.codAfirmacion
      }&codEstadoFlujos=${
      SERVICIOS_PARAMETROS.portafolio.codEstadoFlujos
      }&codCanalVentasIncrementos=${
      SERVICIOS_PARAMETROS.portafolio.codCanalVentasIncrementos
      }&codDisminuirProteccion=${
      SERVICIOS_PARAMETROS.portafolio.codDisminuirProteccion
      }&codEstadoProtecciones=${
      SERVICIOS_PARAMETROS.portafolio.codEstadoProtecciones
      }&codTiposIncrementos=${
      SERVICIOS_PARAMETROS.portafolio.codTiposIncrementos
      }&consecutivo=${consecutivo}&codParamEstados=${
      SERVICIOS_PARAMETROS.portafolio.codParamEstados
      }`;
    return this.http.get(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description
   */
  getEvento(id: string, asoNumInt: string, productoCod: string) {
    const url = `${
      environment.miMutualUtilidadesUrl
      }/evento/validar?codProd=84&consecutivo=${id}&asoNumInt=${asoNumInt}&productoCod=${productoCod}&vigencia=true`;
    return this.http.get(url);
  }

  /**
   *
   * @description Obtiene el detalle de facturacion.
   * @param tipo Tipo de la facturacion.
   * @param periodo  Periodo de facturacion.
   * @param consecutivo  Consecutivo del detalle.
   * @param asoNumInt  Identificador unico de asociado.
   * @return Observable con el detalle de facturacion.
   */
  getFacturacionProteccion(
    tipo: number,
    periodo: number,
    consecutivo: number,
    asoNumInt: number
  ): Observable<FacturacionProteccion> {
    let url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/protecciones/eventos/facturacion`;
    url += `/tipo/${tipo}/periodo/${periodo}/consecutivo/${consecutivo}`;

    return this.http.get<FacturacionProteccion>(url);
  }

  /**
   *
   * @description Obtiene la facturacion de protecciones del asociado.
   * @param options de la consulta. Debe tener como minimo el consecutivo del incremento o decremento del producto.
   * @return Observable con la facturacion de protecciones del asociado.
   */
  getFacturacionProtecciones(
    options: any,
    header: any
  ): Observable<IPage<FacturacionProteccion>> {
    let url = `${environment.miMutualAsociadosUrl}/asociados/${
      options.asoNumInt
      }/protecciones/eventos/facturacion?consecutivo=${options.consecutivo}`;
    url += `&page=${options.page ? options.page : undefined}`;
    url += `&size=${options.size ? options.size : undefined}&sort=${options.sort || 'id'},${options.direction || 'asc'}`;
    url += `&exportar=${options.exportar || 'true'}`;

    const jsonHeaders = Object.assign(header, {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_facturación_portafolio_de_productos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_facturación_portafolio_de_productos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_facturación_portafolio_de_productos.accion
    });

    return this.http.get<IPage<FacturacionProteccion>>(url, { headers: jsonHeaders });
  }

  /**
   *
   * @description Obtiene la facturacion detalle del asociado.
   * @param options El ASO_NUMINT del asociado
   * @return Observable con la facturacion detalle del asociado.
   */
  getFacturasDetalle(asoNumint: any) {
    const url = `${environment.miMutualAsociadosUrl}/sipFacturaDetalle/asoNumint/${asoNumint}`;
    return this.http.get(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el portafolio inactividad
   * @return subscripcion
   */
  getPortafolioInatividad(options: any, header: any) {
    const url = `${environment.miMutualAsociadosUrl}/sipFacInactividad`;

    const jsonHeaders = Object.assign(header, {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_inactividades_portafolio_de_productos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_inactividades_portafolio_de_productos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_inactividades_portafolio_de_productos.accion
    });

    return this.http.get(url, { params: options, headers: jsonHeaders });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el portafolio historico
   * @return subscripcion
   */
  getPortafolioHistorico(options: any, header: any) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${
      options.asoNumInt
      }/protecciones/eventos/historico?consecutivo=${options.consecutivo}&page=${
      options.page
      }&size=${options.size}`;

    const jsonHeaders = Object.assign(header, {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_histórico.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_histórico.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_histórico.accion
    });
    return this.http.get(url, { headers: jsonHeaders });
  }
}
