import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minMaxValidatorDirective(paramaInital: any, paramsFinal, status: any): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    const valueInitial = group.controls[paramaInital].value;
    const valueFinal = group.controls[paramsFinal].value;
    if (Number(valueInitial) >= Number(valueFinal) && valueFinal !== null && valueFinal.length > 0) {
      group.controls[paramsFinal].setErrors({ 'validatorMinMax': true });
      return { 'validatorMinMax': true };
    } else {
      if (status === null) {
        group.controls[paramsFinal].setErrors(null);
      } else if (valueFinal !== null && valueFinal.length === 0) {
        group.controls[paramsFinal].setErrors({ 'required': true });
      }
      return null;
    }
  };
}

export function minMaxValidatorDirectiveValorAsegurado(paramaInital: any, paramsFinal, status: any): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    const valueInitial = group.controls[paramaInital].value;
    const valueFinal = group.controls[paramsFinal].value;
    if (status === null) {
      group.controls[paramsFinal].setErrors(null);
    } else if (valueFinal !== null && valueFinal.length === 0) {
      group.controls[paramsFinal].setErrors({ 'required': true });
    }
    return null;

  };
}

export function minMaxValidator(paramaInital: any, paramsFinal, tipoErr = 'range'): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    let paramaInitalErrors: ValidationErrors = group.controls[paramaInital].errors;
    let paramsFinalErrors: ValidationErrors = group.controls[paramsFinal].errors;
    const valueInitial = group.controls[paramaInital].value;
    const valueFinal = group.controls[paramsFinal].value;

    if (valueInitial !== null && String(valueInitial).length > 0 && valueFinal !== null
      && String(valueFinal).length > 0 && Number(valueInitial) > Number(valueFinal)) {

      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : {};
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : {};
      paramaInitalErrors[tipoErr] = true;
      paramsFinalErrors[tipoErr] = true;
      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      let err = {};
      err[tipoErr] = true;
      return err;
    } else {

      delete paramaInitalErrors?.[tipoErr];
      delete paramsFinalErrors?.[tipoErr];
      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : null;
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : null;
      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      return null;
    }
  };
}

export function entre(paramaInital: any, paramsFinal, paramRange, tipoErr = 'rangeBetenn'): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    let paramaInitalErrors: ValidationErrors = group.controls[paramaInital].errors;
    let paramsFinalErrors: ValidationErrors = group.controls[paramsFinal].errors;
    let paramRangeErrors: ValidationErrors = group.controls[paramRange].errors;

    const valueInitial = group.controls[paramaInital].value;
    const valueFinal = group.controls[paramsFinal].value;
    const valueRangue = group.controls[paramRange].value;

    if (valueInitial !== null && String(valueInitial).length > 0 && valueFinal !== null
      && String(valueFinal).length > 0 && Number(valueInitial) > Number(valueRangue) || Number(valueFinal) < Number(valueRangue)) {

      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : {};
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : {};
      paramRangeErrors = paramRangeErrors && Object.entries(paramRangeErrors).length > 0 ? paramRangeErrors : {};

      paramaInitalErrors[tipoErr] = true;
      paramsFinalErrors[tipoErr] = true;
      paramRangeErrors[tipoErr] = true;

      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      group.controls[paramRange].setErrors(paramRangeErrors);

      let err = {};
      err[tipoErr] = true;
      return err;
    } else {
      
      paramaInitalErrors[tipoErr] = false;
      paramsFinalErrors[tipoErr] = false;
      paramRangeErrors[tipoErr] = false;

      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : null;
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : null;
      paramRangeErrors = paramRangeErrors && Object.entries(paramRangeErrors).length > 0 ? paramRangeErrors : null;

      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      group.controls[paramRange].setErrors(paramRangeErrors);

      return null;
    }
  };
}

export function minMaxEqualValidator(paramaInital: any, paramsFinal, tipoErr = 'range'): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } | null => {
    let paramaInitalErrors: ValidationErrors = group.controls[paramaInital].errors;
    let paramsFinalErrors: ValidationErrors = group.controls[paramsFinal].errors;
    const valueInitial = group.controls[paramaInital].value;
    const valueFinal = group.controls[paramsFinal].value;

    if (valueInitial !== null && valueInitial.length > 0 && valueFinal !== null && valueFinal.length > 0 && Number(valueInitial) >= Number(valueFinal)) {

      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : {};
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : {};
      paramaInitalErrors[tipoErr] = true;
      paramsFinalErrors[tipoErr] = true;
      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      let err = {};
      err[tipoErr] = true;
      return err;
    } else {
      delete paramaInitalErrors?.[tipoErr];
      delete paramsFinalErrors?.[tipoErr];
      paramaInitalErrors = paramaInitalErrors && Object.entries(paramaInitalErrors).length > 0 ? paramaInitalErrors : null;
      paramsFinalErrors = paramsFinalErrors && Object.entries(paramsFinalErrors).length > 0 ? paramsFinalErrors : null;
      group.controls[paramaInital].setErrors(paramaInitalErrors);
      group.controls[paramsFinal].setErrors(paramsFinalErrors);
      return null;
    }
  };
}
