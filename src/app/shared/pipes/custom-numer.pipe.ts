import { Pipe, PipeTransform } from '@angular/core';
/**
 *
 * @description Transforma strings a numeros.
 */
@Pipe({
  name: 'customNumber'
})
export class CustomNumberPipe implements PipeTransform {

  constructor() {
    // do nothing
  }
  /**
   *
   * @description Transforma la moneda.
   * @param valor Valor de la moneda.
   */
  transform(valor: string): any {
    return valor !== undefined && valor !== null ? Number(valor) : 0;
  }
}
