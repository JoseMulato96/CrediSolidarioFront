import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mim-button',
  templateUrl: './mim-button.component.html',
  styleUrls: ['./mim-button.component.css']
})
export class MimButtonComponent {
  /**
   * @description Texto del boton.
   */
  @Input()
  texto: string;

  @Input()
  cssData = '';

  /**
   * @description Indica si el componente esta deshabilitado o no.
   */
  @Input()
  disabled: boolean;

  @Output()
  clickLink: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  copiar: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    // do nothing
  }

  /**
   * @description Lanza evento al dar click.
   */
  onClick() {
    this.clickLink.emit();
  }

  /**
   * @description Lanza evento al copiar.
   */
  onCopiar() {
    this.copiar.emit();
  }
}
