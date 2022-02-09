import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class CIIUStore extends BaseStore {
  private classcompanystore: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener CIIU y guardarla en cache
   */
  protected async GetService() {
    this.classcompanystore = new FormService(this.http);
    let elements: ImasterContent[] = await this.classcompanystore.GetCIIU();
    elements.forEach(x =>
      this.Data.push({
        Label: x["descripcionActividad"],
        Value: x["codigoCiiu"]
      })
    );
    return;
  }
}
