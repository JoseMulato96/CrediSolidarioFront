import { Pipe, PipeTransform } from '@angular/core';

/**
 *
 * @description Pipe para controlar si un dato no viene informado. Se debe mostrar un guion (-).
 */
@Pipe({
  name: 'emptyPipe'
})
export class EmptyPipe implements PipeTransform {

  /**
   *
   * @description Transforma un dato si no viene informado.
   * @param valor Valor del campo.
   */
  transform(valor: string): any {
    return valor !== undefined && valor !== null && valor.length !== 0 ? valor : '-';
  }
}
