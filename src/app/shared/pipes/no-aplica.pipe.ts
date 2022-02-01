import { Pipe, PipeTransform } from '@angular/core';

/**
 *
 * @description Pipe para controlar si un dato no viene informado. Se debe mostrar NA.
 */
@Pipe({
  name: 'noAplicaPipe'
})
export class NoAplicaPipe implements PipeTransform {

  /**
   *
   * @description Transforma un dato si no viene informado.
   * @param valor Valor del campo.
   */
  transform(valor: string): any {
    return valor !== undefined && valor !== null && valor.length !== 0 ? valor : 'NA';
  }
}
