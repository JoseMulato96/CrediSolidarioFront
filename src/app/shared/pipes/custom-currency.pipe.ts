import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/**
 *
 * @description Pipe para transformar la moneda. Contiene el currency pipe de Angular y asi configurar la moneda por defecto.
 * Actualmente Angular no provee un metodo para hacerlo, por ello se enwrapa.
 */
@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(private readonly currencyPipe: CurrencyPipe) { }
  /**
   *
   * @description Transforma la moneda.
   * @param valor Valor de la moneda.
   */
  transform(valor: number): any {
    // Esta linea muestra el valor moneda con dos decimales
    // return this.currencyPipe.transform(valor ? valor : 0, 'COP');
    // Esta linea oculta los decimales en el valor moneda
    return this.currencyPipe.transform(valor ? valor : 0, 'COP', 'symbol', '1.0-0');
  }

  /**
   *
   * @description Transforma el numero.
   * @param valor Valor numerico string.
   */
  transformNumericoDecimal(valor: number): any {
    return this.currencyPipe.transform(valor ? valor : 0, 'COP', '', '3.2-2');
  }

  transformDecimal(valor: number): any {
    return this.currencyPipe.transform(valor ? valor : 0, 'COP', 'symbol', '3.2-2');
  }
}
