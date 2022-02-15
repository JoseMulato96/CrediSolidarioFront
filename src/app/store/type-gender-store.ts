import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeGenderStore extends BaseStore {
  private _form: FormService;

  /**
   * r
   * @description Obtener tipo de genero y guardarla en cache
   */
  protected async GetService() {
    this._form = new FormService(this.http);
    let elements: ImasterContent[] = await this._form.GetTypeGender();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
}
