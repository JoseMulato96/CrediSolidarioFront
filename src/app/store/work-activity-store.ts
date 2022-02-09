import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class WorkActivityStore extends BaseStore {
  private workActivityStore: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener actividades laborales y guardarla en cache
   */
  protected async GetService() {
    this.workActivityStore = new FormService(this.http);
    let elements: ImasterContent[] = await this.workActivityStore.GetWorkActivity();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
