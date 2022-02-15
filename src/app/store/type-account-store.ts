import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeAccountStore extends BaseStore {
  private typeAccountStore: FormService;

  /**
   * r
   * @description Obtener tipo de cuanta y guardarla en cache
   */
  protected async GetService() {
    this.typeAccountStore = new FormService(this.http);
    let elements: ImasterContent[] = await this.typeAccountStore.GetTypeAccount();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
