import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMimInputDecimales]'
})
/*
* La direcitva requiere una trama de dos parametros dividida por ',' la cual
* 1er parametro es para la cantidad de digitos enteros
* 2do parametro para la cantidad de digitos decimales
 */
export class MimInputDecimalesDirective {
  private readonly specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  @Input() appMimInputDecimales: string;

  constructor(private readonly el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const _limites = this.appMimInputDecimales.split(',');
    const _reg = `(^[0-9]{1,${_limites[0]}}$|^[0-9]{1,${_limites[0]}}\\\,[0-9]{0,${_limites[1]}}$)`;
    const regex: RegExp = new RegExp(_reg, 'g');
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? ',' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }

  }
}
