import { EventEmitter, Output } from "@angular/core";
import { BaseComponent, BaseModel } from "./base-component";

export class BButtonComponent extends BaseComponent {
  /// se le cambia el tipo de formato
  Skeleton: ButtonModel;
  constructor() {
    super();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Eventos de cambio estado
   */
  @Output("s-click")
  EvtClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el clin del boton
   */
  OnClick() {
    this.EvtClick.emit();
  }
}

export class ButtonModel extends BaseModel {
  IconCss?: string;
  Disable?: boolean;
}
