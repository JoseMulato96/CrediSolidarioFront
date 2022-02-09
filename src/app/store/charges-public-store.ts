import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class ChargesPublicStore extends BaseStore {
  private server: FormService;
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener cargos publicos y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetChargesPublic();
    elements.forEach(x =>
      this.Data.push({
        Label: x["descParametro"],
        Value: x["consParametro"]
      })
    );
    return;
  }
}
