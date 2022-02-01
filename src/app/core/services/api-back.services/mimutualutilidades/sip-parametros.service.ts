import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';

@Injectable({
  providedIn: 'root'
})
export class SipParametrosService {

  url = `${environment.miMutualUtilidadesUrl}`;

  constructor(private readonly http: HttpClient) { }

  public getParametrosTipo(tipoCodigo: any, options: any = { estado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO }): Observable<any> {
    return this.http.get(
      `${this.url}/sipParametrosTipo/${tipoCodigo}`,
      {
        params: options
      }
    );
  }

  public getParametros(tipoCodigos: any, options: any = { estado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO }): Observable<any> {

    options.tipCod = tipoCodigos;

    return this.http.get(
      `${this.url}/sipparametros`,
      {
        params: options
      }
    );
  }

  public getParametro(tipCod: number, codigo: number, options: any = { estado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO }): Observable<any> {
    return this.http.get(`${this.url}/sipparametros/tipCod/${tipCod}/codigo/${codigo}`, { params: options });
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: Obtener el tipo de auxilio
   * @return subscripcion
   */
  public getTipoAuxilio(tipoCodigo: number[]): Observable<any> {
    return this.http.get(`${this.url}/sipTipoAuxilios/buscar?estados=` + tipoCodigo.join(','));
  }

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: Obtener el tipo de solicitud
   * @return subscripcion
   */
  public getTipoSolicitud() {
    return this.http.get(`${this.url}/sipTipoSolicitud`);
  }

}
