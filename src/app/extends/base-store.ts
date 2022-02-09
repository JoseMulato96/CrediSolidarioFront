import { HttpClient } from "@angular/common/http";
import { IdataComponent } from "../interfaces/idata-component";
import { Utils } from "../utils/utils";

export class BaseStore {
  public Data: IdataComponent[];

  constructor(public http: HttpClient) {
    this.Data = [];
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtener por el filtro de value
   * @param value
   */
  public FindByValue(value: any) {
    return this.FindByKey(value, "Value");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtener item por key
   * @param value
   * @param key
   */
  private FindByKey(value: any, key: string) {
    return this.Data.find(x => x[key] == value);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description interfas para obtener el servicio
   */
  protected async GetService() {
    throw new Error("Method not implemented.");
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener la instacia del Objeto
   */
  public async newData() {
    if (!this.Data.length) {
      await this.GetService();
    }
    return Utils.CopyJson(this.Data);
  }
}
