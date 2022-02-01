import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SERVICIOS_PARAMETROS } from '@shared/static/constantes/servicios-parametros';
import { SIP_LOG_TRANSACCIONAL } from '@shared/static/constantes/sip-log-transaccional';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosAsociadosService {
  constructor(private readonly http: HttpClient) { }

  /**
   * @author Hander Fernando Gutierrez
   * @description Obtener los beneficiarios
   * @return Subscripcion
   * @param asoNumInt Identificador unico de asociado
   */
  getSipBeneficiariosAsociado(asoNumInt: string) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/beneficiarios/asociado?asoNumInt=${asoNumInt}`;

    return this.http.get(url);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener los beneficiarios
   * @return Subscripcion
   * @param asoNumInt Identificador unico de asociado
   */
  getBeneficiarios(asoNumInt: string, param: any): Observable<any> {

    const jsonHeaders = {
      Functionality: SIP_LOG_TRANSACCIONAL.Consulta_datos_beneficiario.funcionalidad,
      Route: SIP_LOG_TRANSACCIONAL.Consulta_datos_beneficiario.ruta,
      Action: SIP_LOG_TRANSACCIONAL.Consulta_datos_beneficiario.accion,
      Observation: SIP_LOG_TRANSACCIONAL.Consulta_datos_beneficiario.observacion
    };

    const url = `${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/beneficiarios`;

    return this.http.get(url, { headers: jsonHeaders, params: param });
  }

  getBeneficiarioPorId(id: any, tipo: any) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/beneficiarios/buscarbeneficiarioasociado`;
    return this.http.get(url, {
      params: {
        identificacion: id,
        tipoId: tipo
      }
    });
  }

  getBeneficiario(id: string) {
    const url = `${environment.miMutualAsociadosUrl}/beneficiarios/${id}`;
    return this.http.get(url);
  }

  getTiposBeneficiarios() {
    const url = `${environment.miMutualAsociadosUrl}/beneficiariostipo`;
    return this.http.get(url, {
      params: { estado: String(SERVICIOS_PARAMETROS.beneficiarios.estadoTipo) }
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description obtener el plan educativo
   */
  getPlanEducativo(asoNumInt: string) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/protecciones/buscar/planeducativo`;
    return this.http.get(url);
  }

  /**
   * @author Edwar Ferney Murillo Arboleda
   * @description obtiene los planes educativos junto con el tipo de beneficiario
   * que no han sido asignados a algun beneficiario.
   * @param asoNumInt
   */
  validarPlanEducativo(asoNumInt: string) {
    const url = `${environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/beneficiarios/validarPlan`;
    return this.http.get(url);
  }

  /**
   *
   * @param asoNumInt
   * @param dato
   */
  guardarBeneficiario(asoNumInt: any, dato: any) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/beneficiarios`;
    return this.http.post(url, dato);
  }

  /**
   *
   * @param asoNumInt
   * @param dato
   */
  actualizaBeneficiario(asoNumInt: any, dato: any) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/beneficiarios`;
    return this.http.put(url, dato);
  }

  /**
   *
   * @param asoNumInt
   * @param dato
   */
  deleteBeneficiario(asoNumInt, dato) {
    const url = `${
      environment.miMutualAsociadosUrl
      }/asociados/${asoNumInt}/beneficiarios/estados`;
    return this.http.post(url, dato);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtiene los promotore
   */
  getPromotores(rols: string[]): Observable<any> {
    const url = `${environment.miMutualBpmUrl}/employee/buscar`;
    return this.http.get(url, {
      params: { rol: rols }
    });
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description obtiene la cobertura
  */
  buscarCobertura(asoNumInt, codTipBen) {
    const url = `${environment.miMutualAsociadosUrl}/asociados/${asoNumInt}/protecciones/buscar/valor-cobertura`;
    return this.http.get(url, {
      params: { codTipBen: codTipBen }
    });
  }
}
