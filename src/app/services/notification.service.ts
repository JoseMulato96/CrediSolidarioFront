import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";

@Injectable()
export class NotificationService extends BaseService {
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description envia un email al prospecto
   * @param idProspecto
   */
  async SendEmail(idProspecto) {
    let url: string = `prospect/${idProspecto}/notification`;
    return this.Post(url, {});
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description solicita si esta permitido mostras el boton coninuar momento 2
   */
  public async CompleteFormPermitRolCommercialForce() {
    let url: string = `property?name=LLENADO_TOTAL_FUERZA`;
    return this.Get(url, {});
  }

  public async GetRangeGraduateDate() {
    let url: string = `property?name=RANGO_FECHA_GRADO`;
    return this.Get(url, {});
  }

  constructor(public http: HttpClient) {
    super(http);
  }

}
