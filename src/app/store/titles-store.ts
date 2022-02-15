import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TitlesStore extends BaseStore {
  private server: FormService;

  /**
   * r
   * @description Obtener titulos profecionales y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetTitles("");
    elements.forEach(x =>
      this.Data.push({
        Label: x["descripcion"],
        Value: x["consTituloacademico"]
      })
    );
    return;
  }

  /**
   * r
   * @description Obtener titulos profecionales y no lo guardar en cache
   */
  protected async GetTitles(value: string) {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetTitles(value);
    let data = [];
    elements.forEach(x =>
      data.push({
        Label: x["descripcion"],
        Value: x["consTituloacademico"]
      })
    );
    return data;
  }

  /**
   * r
   * @description Obtener titulos profecional, filtrado por el valor=consTituloacademico
   * y no guarda en cache
   */
  protected async GetTitleByValue(value: number) {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetTitleByValue(value);
    let data = [];
    elements.forEach(x =>
      data.push({
        Label: x["descripcion"],
        Value: x["consTituloacademico"]
      })
    );
    return data;
  }
}
