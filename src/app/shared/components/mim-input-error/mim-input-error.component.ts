import { Component, Input, Host, SkipSelf } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-mim-input-error',
  templateUrl: './mim-input-error.component.html'
})
export class MimInputErrorComponent {
  @Input()
  controlName: string | string[];
  @Input()
  control: AbstractControl | AbstractControl[];
  @Input()
  errorKey: string | string[];

  constructor(
    @Host() @SkipSelf() private readonly formGrupDirective: FormGroupDirective
  ) {
  }

  /**
   * @description Retorna tru si el input es valido, false si no.
   *
   */
  get isInvalid() {

    let errorKeys;


    // Transformamos a arreglos siempre.
    if (typeof (this.errorKey) === 'string' || this.errorKey instanceof String) {
      errorKeys = [String(this.errorKey)];
    } else if (Array.isArray(this.errorKey)) {
      errorKeys = this.errorKey;
    }

    if (null !== this.control && undefined !== this.control) {
      let controls;

      if (this.control instanceof AbstractControl) {
        controls = [this.control];
      } else if (Array.isArray(this.control)) {
        controls = this.control;
      }

      // Rerroremos cada control name y aplicamos la validacion por cada error key.
      let invalido = false;
      controls.forEach(_control => {
        let controlInvalido = true;

        errorKeys.forEach(_errorKey => {
          controlInvalido = controlInvalido && _control.hasError(_errorKey)
            && (_control.touched || _control.dirty || this.formGrupDirective.submitted);
        });

        invalido = invalido || controlInvalido;
      });

      return invalido;
    } else if (null !== this.controlName && undefined !== this.controlName) {
      let controlNames;

      if (typeof (this.controlName) === 'string' || this.controlName instanceof String) {
        controlNames = [String(this.controlName)];
      } else if (Array.isArray(this.controlName)) {
        controlNames = this.controlName;
      }

      // Rerroremos cada control name y aplicamos la validacion por cada error key.
      let invalido = false;
      controlNames.forEach(_controlName => {
        let controlInvalido = true;
        const _control = this.formGrupDirective.form.get(_controlName);

        errorKeys.forEach(_errorKey => {
          controlInvalido = controlInvalido && _control.hasError(_errorKey)
            && (_control.touched || _control.dirty || this.formGrupDirective.submitted);
        });

        invalido = invalido || controlInvalido;
      });

      return invalido;
    }

    return true;
  }
}
