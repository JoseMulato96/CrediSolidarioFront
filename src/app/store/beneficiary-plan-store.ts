import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class BeneficiaryPlanStore extends BaseStore {
  private beneficiaryPlanService: FormService;
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener plan de beneficiario y guardarla en cache
   */
  protected async GetService() {
    this.beneficiaryPlanService = new FormService(this.http);
    let elements: ImasterContent[] = await this.beneficiaryPlanService.GetBeneficiaryPlan();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
  static FUNERARY: number = 4261;
  static BENEFICIARY: number = 4260;
}
