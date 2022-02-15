import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeChannelStore extends BaseStore {
  private channelService: FormService;

  /**
   * r
   * @description Obtener canales y guardarla en cache
   */
  protected async GetService() {
    this.channelService = new FormService(this.http);
    let elements: ImasterContent[] = await this.channelService.GetTypeChannel();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
