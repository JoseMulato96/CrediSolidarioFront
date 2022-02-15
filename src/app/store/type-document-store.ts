import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class TypeDocumentStore extends BaseStore {
  private _form: FormService;

  /**
   * r
   * @description Obtener tipo de documento y guardarla en cache
   */
  protected async GetService() {
    this._form = new FormService(this.http);
    let elements: ImasterContent[] = await this._form.GetTypeDocument();
    this.Data = [];
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }

  /// tarjeta de identidad
  static TI: number = 5155;
  /** Cedula */
  static CC: number = 1; 
  /// registro civil
  static CIVIL_REGISTRATION: number = 5156;
}
