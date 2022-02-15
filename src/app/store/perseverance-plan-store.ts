import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class PerseverancePlanStore extends BaseStore {
  private perseverancePlane: FormService;

  /**
   * r
   * @description Obtener planes de perseveracia y guardarla en cache
   */
  protected async GetService() {    
    this.perseverancePlane = new FormService(this.http);
    let elements: ImasterContent[] = await this.perseverancePlane.GetPerseverancePlan();
    elements.forEach(x =>
      this.Data.push({ Label: x["prodDescripcion"], Value: x["prodCodigo"] })
    );
    return;
  }
}
