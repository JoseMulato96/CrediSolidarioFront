import { BaseComponent } from "./base-component";
import { Output, EventEmitter } from "@angular/core";
import { Utils } from "../../utils/utils";

export class BSwitchComponent extends BaseComponent {
  constructor() {
    super();
    this.Skeleton.Items.forEach(x => (x._Value = {}));
  }

  /**
   * variable que determina el checkbox|radio|switch
   */
  _Value: any = {};

  _NameGroup: string = "";

  /**
   * Eventos de cambio estado
   */
  @Output("ChangeState")
  EvtChangeState: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Cambia el estado
   * @param item
   */
  ChangeState(item) {
    if (typeof item == "object") {
      this._Value._Select = false;
      this._Value = item;
      this._Value._Select = true;
    }

    this.Skeleton.Data = this._Value;

    // se notifica a todos los componentes inscritos
    this.EvtChangeState.emit(item);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Genera un ID random si no tiene el item un id
   * @param item Elemento
   */
  GeneraId(item) {
    return Utils.GeneralId();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtener y establese id al item
   * @param item
   */
  GeneraIdByItem(item) {
    return item.Id || (item.Id = Utils.GeneralId());
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   *@description Asigna un nombre al Group para que no interfiera en otras instancias
   */
  GeneralNameGroup() {
    this._NameGroup =
      this._NameGroup || (this._NameGroup = Utils.GeneralNameGroup());
    return this._NameGroup.toString();
  }
}
