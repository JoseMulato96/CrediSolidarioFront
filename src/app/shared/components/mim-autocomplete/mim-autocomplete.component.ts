import { Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-mim-autocomplete',
  templateUrl: './mim-autocomplete.component.html',
  styleUrls: ['./mim-autocomplete.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MimAutocompleteComponent),
    multi: true
  }]
})
export class MimAutocompleteComponent implements ControlValueAccessor {
  /**
  * @description Id del input interno del componente.
  */
  @Input()
  inputId: string;

  /**
   * @description LLave del objeto de seleccion.
   */
  @Input()
  optionKey: string;

  @Input()
  optionField: string;

  @Input()
  suggestions: any[];

  @Input()
  minLength: number;

  @Input()
  disabled: boolean;

  @Output()
  completeMethod: EventEmitter<any> = new EventEmitter<any>();

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

  get value(): any {
    return this.modelo;
  }

  set setValue(modelo: any) {
    if (modelo === this.modelo) {
      this.modelo = modelo;
    }
  }

  _onCompleteMethod(event: any) {
    this.completeMethod.emit(event);
  }

  _onAutocompleteChange(event: any) {
    const modelo = event;
    this.writeValue(modelo);
  }
}
