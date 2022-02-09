import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class ViculacionStore extends BaseStore {
  private academicLevel: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener vinculados y guardarla en cache
   */
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetViculado();
    elements.forEach(x => {
      this.Data.push({
        Label: x["descCategoria"],
        Value: x["consCategoria"]
      });
    });
    return;
  }
}
