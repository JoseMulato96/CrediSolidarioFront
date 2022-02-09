import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class OfficesStore extends BaseStore {
  private academicLevel: FormService;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener oficinas de coomeva y guardarla en cache
   */
  protected async GetService() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetOfficesByName(
      ""
    );
    elements.forEach(x =>
      this.Data.push({ Label: x["descCategoria"], Value: x["consCategoria"] })
    );
    return;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener oficinas de coomeva y sin guardarla en cache
   */
  protected async GetOffice(nivel) {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetOfficesByNivel(
      "2"
    );
    let data = [];
    elements.forEach(x =>
      data.push({
        Label: x["descLocalizacion"],
        Value: x["consLocalizacion"]
      })
    );
    return data;
  }

  /**
     * @author Jose Wilson Mulato
     * @description Obtener oficinas de coomeva por zona y sin guardarla en cache
     */
  protected async GetOfficeZona() {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetOfficesByNivel(
      "3"
    );
    let data = [];
    elements.forEach(x =>
      data.push({
        Label: x["descLocalizacion"],
        Value: x["consLocalizacion"]
      })
    );
    return data;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtener oficina por el nombre
   */
  public async GetOfficesByName(value: string, options: any) {
    this.academicLevel = new FormService(this.http);
    let elements: ImasterContent[] = await this.academicLevel.GetOfficesByName(
      value
    );
    elements.forEach(x => {
      let exit = this.Data.find(y => y.Value == x["consLocalizacion"]);
      !exit &&
        this.Data.push({
          Label: x["descLocalizacion"],
          Value: x["consLocalizacion"]
        });
    });
    return this.Data;
  }
}
