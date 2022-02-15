import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class EntityBankStore extends BaseStore {
  private channelService: FormService;

  /**
   * r
   * @description Obtener bancos y guardarla en cache
   */
  protected async GetService() {
    this.channelService = new FormService(this.http);
    let elements: ImasterContent[] = await this.channelService.GetBanks();
    elements.forEach(x =>
      this.Data.push({
        Label: x["descripcion"],
        Value: x["consEntidadFinanciera"]
      })
    );
    return;
  }
}
