import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class OcupationStore extends BaseStore {
  private ocupationService: FormService;

  /**
   * r
   * @description Obtener Ocupaciones y guardarla en cache
   */
  protected async GetService() {
    this.ocupationService = new FormService(this.http);
    let elements: ImasterContent[] = await this.ocupationService.GetOcupationService();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
