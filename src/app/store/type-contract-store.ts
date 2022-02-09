import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeContractStore extends BaseStore {
  private serviceform: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener tipo de contrato y guardarla en cache
   */
  protected async GetService() {
    this.serviceform = new FormService(this.http);
    let elements: ImasterContent[] = await this.serviceform.GetTypeContract();
    elements.forEach(x =>
      this.Data.push({ Label: x.valor, Value: x.consParametro })
    );
    return;
  }
}
