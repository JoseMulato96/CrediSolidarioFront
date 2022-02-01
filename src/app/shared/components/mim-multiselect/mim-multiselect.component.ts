import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/api/selectitem';

@Component({
  selector: 'app-mim-multiselect',
  templateUrl: './mim-multiselect.component.html',
  styleUrls: ['./mim-multiselect.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MimMultiselectComponent),
      multi: true
    }
  ]
})
export class MimMultiselectComponent implements ControlValueAccessor {
  nameKeyOpt: string;
  _options: SelectItem[];
  /**
 * @description Id del input interno del componente.
 */
  @Input()
  inputId: string;

  /**
  * @description LLave del objeto de seleccion.
  */
  @Input('optionKey') set optionKey(dataKey: string) {
    this.nameKeyOpt = dataKey;
    if (this._options) {
      this._options = this._options && this._options.map(opt => {
        return {
          label: this._obtenerValorName(dataKey, opt),
          value: opt
        };
      });
    }
  }

  /**
   * @description Opciones del componente de seleccion.
   */
  @Input('options')
  set options(options: any) {
    if (this.nameKeyOpt !== '' && this.nameKeyOpt !== undefined && this.nameKeyOpt !== null) {
      this._options = options && options.map(option => {
        return {
          label: this._obtenerValorName(this.nameKeyOpt, option),
          value: option
        };
      });
    } else {
      this._options = options;
    }
  }

  /**
   * @description Indica si el componente esta deshabilitado o no.
   */
  @Input()
  disabled: boolean;

  @Output()
  blur: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeValue: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description Modelo del componente.
   */
  modelo: any;

  /**
   * @description Funcion a llamar cuando el modelo cambia.
   */
  onChange = (_: any) => {
    // do nothing
  };

  /**
   * @description Funcion a llamar cuando el componente es tocado.
   */
  onTouched = () => {
    // do nothing
  };

  constructor() {
    // do nothing
  }

  /**
   * @description Permite que Angular actualice el modelo.
   * Actualiza el modelo y aplica cambios necesarios para la vista aqui.
   * @param model Modelo del componente.
   */
  writeValue(modelo: any): void {
    // Actualizamos el modelo.
    this.modelo = modelo || null;
    // Propagamos el cambio.
    this.onChange(this.modelo);
  }

  /**
   * @description Permite a Angular registrar una funcion a llamar cuando el modelo cambia.
   * @param fn Funcion disparada en cambios.
   */
  registerOnChange(fn: (modelo: any) => void): void {
    this.onChange = fn;
  }

  /**
   * @description Permite a Angular registrar la funcion a llamar cuando el input ha sido tocado.
   * @param fn Funcion disparada al tocar el componente.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * @description Marca como deshabilitado el input.
   * @param isDisabled Esta deshabilitado.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get value(): any {
    return this.modelo;
  }

  set setValue(modelo: any) {
    if (modelo === this.modelo) {
      this.modelo = modelo;
    }
  }

  _onSelectChange(event: any) {
    const modelo = event;
    this.writeValue(modelo);
    this.changeValue.emit(event);
    this.blur.emit(event);
  }

  _onBlur(event) {
    this.blur.emit(event);
  }

  _obtenerValorName(columnaKey: string, rowData: any) {
    let obj: object;
    if (columnaKey.includes('.')) {
      for (const _columnaKey of columnaKey.split('.')) {
        obj = obj === undefined || obj === null ? rowData[_columnaKey] : obj[_columnaKey];
      }
    } else {
      obj = rowData[columnaKey];
    }

    return obj !== undefined && obj !== null ? String(obj) : '';
  }

}
