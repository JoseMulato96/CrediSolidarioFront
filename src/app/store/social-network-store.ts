import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class SocialNetworkStore extends BaseStore {
  private server: FormService;
  /**
   * @author Edwar Ferney Murillo
   * @description Obtener las redes sociales y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetSocialNetwork();
    elements.forEach(x =>
      this.Data.push({
        Label: x["descParametro"],
        Value: x["consParametro"]
      })
    );
    return;
  }
}
