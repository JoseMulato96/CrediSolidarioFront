import { BaseStore } from "../extends/base-store";
import { ImasterContent } from "../interfaces/imaster-content";
import { FormService } from "../services/form.service";

export class RelationshipStore extends BaseStore {
  private relationshipService: FormService;

  /**
   * r
   * @description Obtener Tipo de relaciones (Padres, Madre, Hijo...) y guardarla en cache
   */
  protected async GetService() {
    this.relationshipService = new FormService(this.http);
    let elements: ImasterContent[] = await this.relationshipService.GetRelationship();  
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
      
    );
    return;
    
  }
  /** @description padre valor 5001 */
  static FATHER: number = 5001;
  /** @description padre valor 5000 */
  static MOTHER: number = 5000;
  /** @description padre valor 5003 */
  static CHILDER_GRILD: number = 5003;
  /** @description padre valor 5004 */
  static CHILDER_SPOUSE: number = 5004;
  /** @description padre valor 5002 */
  static CHILDER_BOY: number = 5002;
}

export class RelationshipStoreFa extends BaseStore {
  private relationshipService: FormService;

  /**
   * r
   * @description Obtener Tipo de relaciones (Padres, Madre, Hijo...) y guardarla en cache
   */
  protected async GetService() {
    this.relationshipService = new FormService(this.http);
    let elements: ImasterContent[] = await this.relationshipService.GetRelationShipFa();
    elements.forEach(x =>
      this.Data.push({ Label: x.descParametro, Value: x.consParametro })
    );
    return;
  }
  /** @description padre valor 5001 */
  static FATHER: number = 5001;
  /** @description padre valor 5000 */
  static MOTHER: number = 5000;
  /** @description padre valor 5003 */
  static CHILDER_GRILD: number = 5003;
  /** @description padre valor 5004 */
  static CHILDER_SPOUSE: number = 5004;
  /** @description padre valor 5002 */
  static CHILDER_BOY: number = 5002;
}