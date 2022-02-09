import { BaseComponent } from "../shared/extends-components/base-component";
import { MainStore } from "../store/main-store";
import { IResponseService } from "../interfaces/response-service";

export class BaseSection {
  typeLoadFiles: number = -1;
  // realiza el efecto visual presionado
  _toggleOption: number = 2;

  constructor() {

  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida los componentes si esta correcto
   * @param components
   */
  ValidFields(components: BaseComponent[]) {
    let isValid: boolean = true;
    components.forEach(comp => {
      let validComp: boolean = comp.Valid();
      isValid = isValid && validComp;
    });
    return isValid;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Bloquea los componentes para que no sea editable
   */
  IsLockSection(components: BaseComponent[]) {
    components.forEach(c => c.SetDisable(true));
  }

  /**
   * @author John Nelson Rodríguez
   * @description Desbloquea los componentes para que sean editables
   */
  UnLockSection(components: BaseComponent[]) {
    components.forEach(c => c.SetDisable(false));
  }
}
