import { Directive, SkipSelf, Host, HostBinding, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[appMimInput]',
})
export class MimInputDirective {

  @Input()
  for: string;

  @Input()
  controlName: string;

  constructor(
    @Host() @SkipSelf() private readonly form: FormGroupDirective,
  ) {
  }

   /**
   * @description Retorna true si el input es focused, false sino.
   *
   */
  @HostBinding('class.border--orange1')
  get isFocused() {
    const input: any =  document.getElementById(this.for);
    return document.activeElement === input && !input.disabled;
  }

   /**
   * @description Retorna true si el input es valido, false si no.
   *
   */
  @HostBinding('class.border--red1')
  get isInvalid() {
    const control = this.form.form.get(this.controlName);
    return control.invalid && (control.touched || control.dirty || this.form.submitted);
  }
}
