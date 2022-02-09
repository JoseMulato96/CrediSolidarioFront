import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeProductStore extends BaseStore {
  private typeProductStore: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener tipo de productos y guardarla en cache
   */
  protected async GetService() {
    this.typeProductStore = new FormService(this.http);
    let elements: ImasterContent[] = await this.typeProductStore.GetTypeProduct();
    elements.forEach(x =>
      this.Data.push({ Label: x.valor, Value: x.consParametro })
    );
    return;
  }
}
