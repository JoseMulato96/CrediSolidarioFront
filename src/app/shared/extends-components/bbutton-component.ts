import { EventEmitter, Output } from "@angular/core";
import { BaseComponent, BaseModel } from "./base-component";

export class BButtonComponent extends BaseComponent {
  /// se le cambia el tipo de formato
  Skeleton: ButtonModel;
  constructor() {
    super();
  }

  /**
   * r
   * @description Eventos de cambio estado
   */
  @Output("s-click")
  EvtClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * r
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
