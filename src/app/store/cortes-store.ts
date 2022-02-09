import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class CortesStore extends BaseStore {
  private cortes: FormService;

  /**
   * @author Jose Wilson Mulato-Kalettre
   * @description Obtener fechas corte y guardarla en cache
   */
  protected async GetService() {    
    this.cortes = new FormService(this.http);
    let elements: ImasterContent[] = await this.cortes.GetFechaCortes();    
    elements.forEach(x =>
      this.Data.push({ Label: x.valor, Value: x.consParametro })
    );
    return;
  }
}
