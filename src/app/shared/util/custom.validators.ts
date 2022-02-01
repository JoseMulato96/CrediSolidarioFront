import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DateUtil } from './date.util';

export class CustomValidators {
  static PasswordPattern(control: AbstractControl) {
    if (/'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'/.test(control.value)) {
      return null;
    } else {
      control.get('confirm').setErrors({ passwordpattern: true });
    }
  }

  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'cannotContainSpace': true };
  }

  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ matchpassword: true });
    } else {
      return null;
    }
  }

  static EqualsPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const oldPassword = control.get('oldPassword').value;
    if (password === oldPassword) {
      control.get('password').setErrors({ equalspassword: true });
    } else {
      return null;
    }
  }

  static TextPattern(control: AbstractControl) {
    if (/'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'/.test(control.value)) {
      return null;
    } else {
      control.setErrors({ textpattern: true });
    }
  }

  static minNumberText(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && String(value).length > 0 && !isNaN(Number(value)) && String(value).length < minValue ) {
        return { 'min': true };
      } else {
        return null;
      }
    };
  }

  static maxNumberText(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && String(value).length > 0 && !isNaN(Number(value)) && String(value).length > maxValue ) {
        return { 'max': true };
      } else {
        return null;
      }
    };
  }

  static vacio(control: AbstractControl) {
    if ( control.value && control.value !== null && control.value.trim() === '') {
      return { vacio: true };
    }
    return null;
  }

  static CampoVacio(value: any): boolean {
    return !String(value || '').trim();
  }


  static ValorMinimoProteccioNNoNegative(control: AbstractControl) {
    const valor = +control.get('valorMinimoProteccion').value;

    if (valor >= 0) {
      return null;
    } else {
      control.get('valorMinimoProteccion').setErrors({ noNegative: true });
    }
  }

  static RangoFechaObligatorio(control: AbstractControl) {
    const fecha = control.get('fechaInicioFechaFin').value;

    if (fecha !== null) {

      const fechaInicio =  DateUtil.dateToString(fecha[0], 'dd-MM-yyyy');
      const fechaFinal =  DateUtil.dateToString(fecha[1], 'dd-MM-yyyy');

      if (fechaInicio === null || fechaFinal === null) {
        control.get('fechaInicioFechaFin').setErrors({ rangoObligatorio: true });
      } else {
        return null;
      }
    } else {
      return null;
    }

  }

  static RangoFechaDias(dias: number) {

    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const fecha = control.value;

      if (fecha !== null) {

        const fechaInicio = fecha[0];
        const fechaFin = fecha[1];

        if (fechaInicio && fechaFin && fechaInicio !== null && fechaFin !== null) {
          if (DateUtil.obtenerDiasEntre({ fechaInicio, fechaFin }) > dias) {
            return { rangoError: true };
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    };
  }

}
