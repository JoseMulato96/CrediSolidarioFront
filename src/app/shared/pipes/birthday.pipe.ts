import { Pipe, PipeTransform } from '@angular/core';
import { DateUtil } from '@shared/util/date.util';

@Pipe({
  name: 'birthday'
})
export class BirthdayPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let fecha: Date;
    if (typeof (value) === 'string') {
      fecha = DateUtil.stringToDate(value);
    } else {
      fecha = value;
    }
    return DateUtil.calcularEdad(fecha);
  }
}
