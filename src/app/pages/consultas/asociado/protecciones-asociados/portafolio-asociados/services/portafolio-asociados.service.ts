import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable()
export class PortafolioAsociadosService {
  constructor(private readonly http: HttpClient) { }

  getEventosDetalleProducto(asoNumInt: string, proCod: number, nombreProducto: string) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_detalle_portafolio_de_producto.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_detalle_portafolio_de_producto.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_detalle_portafolio_de_producto.accion,
      Observation: String(proCod) + ',' + nombreProducto
    };
    return this.http.get(`${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/protecciones/eventos?proCod=${proCod}`, { headers: jsonHeaders });
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: Obtener el portafolio del asociado
   * @return el detalle del asociado
   */
  getPortafolioAsociado(id: string): Observable<object> {
    return this.http.get(
      `${environment.miMutualAsociadosUrl}/getPortafolioAsociados/${id}`
    );
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: Obtener los detalle del producto del asociado
   * @return Subscripcion
   * @param asoNumInt Identificador unico de asociado
   */
  getPlanesAsociado(asoNumInt: string) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_protecciones_portafolio_de_productos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_protecciones_portafolio_de_productos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_protecciones_portafolio_de_productos.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_protecciones_portafolio_de_productos.observacion
    };

    return this.http.get(`${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/protecciones?estados=${SERVICIOS_PARAMETROS.portafolioAsociados.estados}`, { headers: jsonHeaders });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener las vinculaciones
   * @return subscripcion
   */
  getVinculacion(id: string) {
    return this.http.get(`${environment.miMutualAsociadosUrl}/vinculacion/acumulados/${id}`);
  }
}
