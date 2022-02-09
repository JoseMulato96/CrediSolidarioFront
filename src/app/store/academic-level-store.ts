import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class AcademicLevelStore extends BaseStore {
  private academicLevel: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener niveles academico y guardarla en cache
   */
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetAcademicLevel();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
