import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
})
export class PopupMenuComponent implements OnInit {

  constructor() {
    // do nothing
  }

  _cssMostrar: any = {};
  _cssMostrarModal: any = { 'display': 'none' };
  _tag: any;

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: PopupMenuConfig = new PopupMenuConfig();

  // tslint:disable-next-line:no-output-rename
  @Output('click-item')
  clickItemPopup: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.configuracion.component = this;
    this.configuracion.items = this.configuracion.items || [];
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description mostrar
  */
  public mostrar(x: number, y: number, dato: any) {
    this._tag = dato;
    this._cssMostrar = {
      // 'top': y + 'px',
      'top': '45%',
      'left': x + 'px',
      'position': 'absolute'
    };
    this._cssMostrarModal = {
      'top': '0px',
      'left': '0px',
      'position': 'fixed',
      'background-color': '#0000006e',
      'width': '100vw',
      'height': '100vh',
      'z-index': '1040'
    };
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escucha el evento de cerrar
  */
  _onClickClose(e) {
    this.ocultar();
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escuchar el evento de cerra cuando dan click en el modal
  */
  _onClickCloseModal(e) {
    this.ocultar();
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description oculta el popup
  */
  public ocultar() {
    this._cssMostrar = {};
    this._tag = undefined;
    this._cssMostrarModal = {
      'display': 'none'
    };
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description escucha el evento cuando dan al item del popup
  */
  _onClickItem(e, item) {
    e.stopPropagation();
    this.clickItemPopup.emit({
      e,
      item,
      dato: this._tag
    });
  }

  _onNoClick(e) {
    e.stopPropagation();
  }
}

export class PopupMenuConfig {
  component: PopupMenuComponent;
  items: ItemPopupMenuConfig[] = [];
}

export class ItemPopupMenuConfig {
  label = '';
  value: any = '';
  cssIcon = '';
  items?: ItemPopupMenuConfig[] = [];
  disabled?: boolean;
}
