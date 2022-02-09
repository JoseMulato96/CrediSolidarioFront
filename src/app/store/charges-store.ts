import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class ChargesStore extends BaseStore {
  private server: FormService;
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener cargos y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetCharges(8);
    elements.forEach(x =>
      this.Data.push({
        Label: x["descripcion"],
        Value: x["consTituloacademico"]
      })
    );
    return;
  }
}
