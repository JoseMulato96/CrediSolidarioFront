import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeMoneyStore extends BaseStore {
  private typeMoney: FormService;

  /**
   * r
   * @description Obtener tipos de monedas y guardarla en cache
   */
  protected async GetService() {
    this.typeMoney = new FormService(this.http);
    let elements: ImasterContent[] = await this.typeMoney.GetTypeMoneda();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
