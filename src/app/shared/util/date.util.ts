import { GENERALES } from '@shared/static/constantes/constantes';
import { DatePipe } from '@angular/common';

export class DateUtil {

  public static calcularEdad(fechaNacimiento: Date, fechaActual: Date = new Date()): number {
    const timeDiff = Math.abs(<any>fechaActual - <any>fechaNacimiento);
    return Math.trunc(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  public static stringToDate(fecha: string) {
    if (!fecha) {
      return undefined;
    }

    const res: any = fecha.indexOf('-') !== -1 ? fecha.split('-') : fecha.split('/');
    const dia: number = res[0];
    const mes: number = res[1] - 1;
    const anio: number = res[2];

    return new Date(anio, mes, dia);
  }

  public static dateToString(fecha: Date, format: string = GENERALES.FECHA_PATTERN) {
    if (fecha === null || fecha === undefined) {
      return null;
    }
    const pipe = new DatePipe('es-CO');
    return pipe.transform(fecha, format);
  }

  public static hourString(hour: Date, format: string = GENERALES.HORA_PATTERN) {
    if (hour === null || hour === undefined) {
      return null;
    }
    const pipe = new DatePipe('es-CO');
    return pipe.transform(hour, format);
  }

  public static obtenerDiasEntre({ fechaInicio, fechaFin }: { fechaInicio: Date; fechaFin: Date; }) {
    return ((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  public static nombreMes(monthNumber) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthNumber - 1];
  }

  public static isBefore(left: Date, right: Date): boolean {
    return left < right;
  }

  public static isAfter(left: Date, right: Date): boolean {
    return left < right;
  }

  public static isEqual(left: Date, right: Date): boolean {
    return left === right;
  }

  public static nextBirthDayDate(birthDate: Date): Date {
    const today = new Date();
    // Obtenemos la fecha de cumpleaños del año actual.
    const nextBirthDayDate = new Date(birthDate);
    nextBirthDayDate.setFullYear(today.getFullYear());

    // Si el ecumpleaños ya ocurrio agrega un año.
    if (DateUtil.isBefore(nextBirthDayDate, today) || DateUtil.isEqual(nextBirthDayDate, today)) {
      nextBirthDayDate.setFullYear(today.getFullYear() + 1);
    }

    return nextBirthDayDate;
  }

}
