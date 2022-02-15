import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class StateAccountStore extends BaseStore {
  private statusCivilStore: FormService;

  /**
   * r
   * @description Obtener tipo de cuenta y guardarla en cache
   */
  protected async GetService() {
    this.statusCivilStore = new FormService(this.http);
    let elements: ImasterContent[] = await this.statusCivilStore.GetTypeAccount();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
