import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class AgentsStore extends BaseStore {
  private server: FormService;
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener agentes y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetAgents();
    this.Data = [];

    elements.forEach(x =>
      this.Data.push({
        Label: x["nombre"] + " " + x["apellidos"],
        Tag: x["login"],
        Value: x["idAgente"]
      })
    );
    this.Data = this.Data.sort((a, b) => {
      return a.Label < b.Label ? -1 : 1;
    });
    return;
  }
}
