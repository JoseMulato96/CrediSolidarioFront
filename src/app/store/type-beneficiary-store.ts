import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeBeneficiaryStore extends BaseStore {
  private service: FormService;

  /**
   * r
   * @description Obtener vinculados y guardarla en cache
   */
  protected async GetService() {
    this.service = new FormService(this.http);
    let elements: ImasterContent[] = await this.service.TypeBeneficiary();
    elements.forEach(x =>
      this.Data.push({ Label: x.valor, Value: x.consParametro })
    );
    return;
  }

  static FUNERARIO: number = 4261;
  static BENEFICIARIO: number = 4260;
}
