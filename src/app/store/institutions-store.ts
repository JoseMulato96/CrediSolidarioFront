import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class InstitutionsStore extends BaseStore {
  private server: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener instituciones y guardarla en cache
   */
  protected async GetService() {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetInstitutions("");
    elements.forEach(x =>
      this.Data.push({
        Label: x["descripcion"],
        Value: x["consInstacademica"]
      })
    );
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener instituciones buscando por el nombre
   */
  protected async GetInstitucionesByName(value: string) {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetInstitutions(value);
    let data = [];
    elements &&
      elements.forEach(x =>
        data.push({
          Label: x["descripcion"],
          Value: x["consInstacademica"]
        })
      );

    return data;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener instituciones buscando por el value
   */
  public async GetInstitucionesByValue(value: number) {
    this.server = new FormService(this.http);
    let elements: ImasterContent[] = await this.server.GetInstitutionsByValue(
      value
    );
    let data = [];
    elements &&
      elements.forEach(x =>
        data.push({
          Label: x["descripcion"],
          Value: x["consInstacademica"]
        })
      );

    return data;
  }
}
