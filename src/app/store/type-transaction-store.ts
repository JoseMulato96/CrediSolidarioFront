import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";
/// depreciado
export class TypeTransactionStore extends BaseStore {
  private typeTransaction: FormService;

  /**
   * r
   * @description Obtener tipo de transacción y guardarla en cache
   */
  protected async GetService() {
    this.typeTransaction = new FormService(this.http);
    let elements: ImasterContent[] = await this.typeTransaction.GetTypeTransaction();
    elements.forEach(x =>
      this.Data.push({ Label: x.valor, Value: x.consParametro })
    );
    return;
  }
}
