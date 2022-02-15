import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { FilterConsultModel } from "../shared/models/filter-consult-model";
import { IResponseService } from "../interfaces/response-service";
import { ResponseEnum } from "../enums/ResponseEnum.enum";
import { AppComponent } from "../app.component";

@Injectable()
export class ConsultService extends BaseService {
  constructor(public http: HttpClient) {
    super(http);
  }

  /**
   * r
   * @description consulta los agentes por el auxiliar
   * @param filterConsult filtros
   */
  GetConsultFilterAuxSupervisor(filterConsult: FilterConsultModel): any {
    let url: string = `queryAuxiliar?`;
    return this.GetConsultFilter(url, filterConsult);
  }
  /**
   * r
   * @description consulta los agentes por el supervisor
   * @param filterConsult filtros
   */
  GetConsultFilterSupervisor(filterConsult: FilterConsultModel): any {
    let url: string = `querySupervisor?`;
    return this.GetConsultFilter(url, filterConsult);
  }

  /**
   * r
   * @description consulta las solicitudes del agente
   * @param filterConsult filtros
   */
  GetConsultFilterAgent(filterConsult: FilterConsultModel): any {
    let url: string = `queryAgente?`;
    return this.GetConsultFilter(url, filterConsult);
  }

  /**
   * r
   * @description Obtiene los datos por los filtros enviados
   */
  GetConsultFilterCommercialForce(filterConsult: FilterConsultModel) {
    let url: string = `queryFuerzaComercial?`;
    return this.GetConsultFilter(url, filterConsult);
  }

  /**
   * @author Jose Wilson Mulato
   * @description Obtiene los datos por los filtros enviados
   */
  GetConsultFilterLiderNacional(filterConsult: FilterConsultModel) {
    let url: string = `queryLiderNacional?`;
    return this.GetConsultFilter(url, filterConsult);
  }

  /**
   * @author Jose Wilson Mulato
   * @description Obtiene los datos por los filtros enviados
   */
  GetConsultFilterLiderRegional(filterConsult: FilterConsultModel) {
    let url: string = `queryLiderRegional?`;
    return this.GetConsultFilter(url, filterConsult);
  }


  GetConsultFilterLiderRegionalEvidente(filterConsult: FilterConsultModel) {
    let url: string = `queryLiderRegionalEvidente?`;
    return this.GetConsultFilter(url, filterConsult);
  }



  /**
   * r
   * @description Obtiene los datos por los filtros enviados
   */
  GetAssign(idSolicitud: string, idAgente: string, labelAgente: string) {
    let url: string = `solicitud/${idSolicitud}/agente/${idAgente}?userId=${labelAgente}`;
    return this.Put(url, {});
  }

  /**
   * r
   * @description Obtiene el exportar
   * @param pageSize
   * @param pageCurrent
   */
  ExportExcelAux(pageSize: number, pageCurrent: number, ids: number[]) {
    // http://localhost:8081/CeroPapel/queryAuxiliarExport?pageSize=5&pageCurrent=1&ids=1&ids=2&ids=3&ids=4&ids=5&ids=6&ids=7&ids=8&ids=9
    let url: string = `queryAuxiliarExport?pageSize=${pageSize}&pageCurrent=${pageCurrent}&ids=${ids.join(
      "&ids="
    )}`;
    return this.Get(url, {});
  }

  ExportExcelConsultFilterFuerza(filterConsult: FilterConsultModel) {
    let params: string[] = [];
    for (const key in filterConsult) {
      if (filterConsult.hasOwnProperty(key)) {
        !!filterConsult[key] && params.push(key + "=" + filterConsult[key]);
      }
    }
    let url = 'queryFuerzaComerExport?' + params.join("&");
    return this.Get(url, filterConsult);
  }


  ExportExcelConsultFilterLiderNacional(filterConsult: FilterConsultModel) {
    let params: string[] = [];
    for (const key in filterConsult) {
      if (filterConsult.hasOwnProperty(key)) {
        !!filterConsult[key] && params.push(key + "=" + filterConsult[key]);
      }
    }
    let url = 'queryliderNacionalExport?' + params.join("&");
    return this.Get(url, filterConsult);
  }


  ExportExcelConsultFilterLiderRegional(filterConsult: FilterConsultModel) {
    let params: string[] = [];
    for (const key in filterConsult) {
      if (filterConsult.hasOwnProperty(key)) {
        !!filterConsult[key] && params.push(key + "=" + filterConsult[key]);
      }
    }
    let url = 'queryliderRegionalExport?' + params.join("&");
    return this.Get(url, filterConsult);
  }

  private GetConsultFilter(url: string, filterConsult: FilterConsultModel) {
    let params: string[] = [];
    for (const key in filterConsult) {
      if (filterConsult.hasOwnProperty(key)) {
        !!filterConsult[key] && params.push(key + "=" + filterConsult[key]);
      }
    }
    url = url + params.join("&");
    return this.Get(url, filterConsult);
  }



}
