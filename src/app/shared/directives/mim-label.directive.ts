import { Directive, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMimLabel]',
})
export class MimLabelDirective {

  constructor(
    private readonly hostElement: ElementRef
  ) {
  }

   /**
   * @description Retorna tru si el input es valido, false si no.
   *
   */
  @HostBinding('class.text--orange1-important')
  get isFocused() {
    const labelElement = this.hostElement.nativeElement;
    const input: any = document.getElementById(labelElement.htmlFor);
    return document.activeElement === input && !input.disabled;
  }
}
