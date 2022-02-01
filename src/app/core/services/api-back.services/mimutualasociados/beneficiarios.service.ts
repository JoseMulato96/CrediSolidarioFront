import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los totales de multiativa
   */
  getBeneficiarioRepetidos(options: any = {}) {
    const url = `${environment.miMutualAsociadosUrl}/beneficiarios/repetidos`;

    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_repetidos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_repetidos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_repetidos.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_repetidos.observacion
    };

    return this.http.get(url, { params: options, headers: jsonHeaders });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los beneficiarios fallecidos
   */
  getBeneficiarioFallecidos(options: any = {}) {
    const url = `${environment.miMutualAsociadosUrl}/beneficiarios/fallecidos`;

    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_fallecidos.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_fallecidos.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_fallecidos.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_beneficiarios_fallecidos.observacion
    };

    return this.http.get(url, { params: options, headers: jsonHeaders });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los beneficiarios fallecidos
   */
  getBeneficiarioFallecidosExcel(options: any = {}): Observable<any> {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/fallecidos`;
    options.exportar = true;
    return this.http.get(url, { params: options });
  }

  getBeneficiarioRepetidosExcel(options: any): Observable<any> {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/repetidos`;
    options.exportar = true;
    return this.http.get(url, { params: options });
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtiene los beneficiarios
   */
  getBeneficiariosInformacion(options) {
    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_información_beneficiario.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_información_beneficiario.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_información_beneficiario.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_información_beneficiario.observacion
    };
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/buscarIdentificacionNombresApellidos`;
    return this.http.get(url, { params: options, headers: jsonHeaders });
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el asociado del beneficiario
   */
  getBeneficiariosAsociadoRelacionado(codBeneficiario: any, options: any) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/${codBeneficiario}/asociados/buscarCodBen`;
    return this.http.get(url, { params: options });
  }

  /**
 * @author Jorge Luis Caviedes Alvarado
 * @description Obtener el asociado del beneficiario
 */
  getBeneficiariosAsociadoRelacionadoActualizacionFecha(codBeneficiario: any, options: any) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/${codBeneficiario}/asociados/buscarAsociadosRelacionados`;
    return this.http.get(url, { params: options });
  }

  previsualizarActualizarFechaNacimiento(codBeneficiario: any, objectoPrevisualizar: any): Observable<any> {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/${codBeneficiario}/asociados/actualizacionFechaNacimiento`;
    return this.http.post(url, objectoPrevisualizar);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtener los datos del beneficiario con respecto al codigo del beneficiario
   */
  getBenetificiarioPorCodigo(codBeneficiario: string) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/${codBeneficiario}/buscarBeneficiario`;
    return this.http.get(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el historial del beneficiario
   */
  getBeneficiariosHistorico(
    codBeneficiario: string,
    asoNumInt: string,
    options: any
  ) {
    options.asoNumInt = asoNumInt;
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/${codBeneficiario}/asociados/buscarCodBenAsoNumInt`;
    return this.http.get(url, { params: options });
  }
}
