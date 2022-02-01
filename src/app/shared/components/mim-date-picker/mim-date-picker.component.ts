import {
  Component, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

export const ES = {
  firstDayOfWeek: 0,
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Je', 'Vi', 'Sa'],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  today: 'Hoy',
  clear: 'Limpiar',
  dateFormat: 'dd-mm-yy',
  weekHeader: 'Sm'
};

@Component({
  selector: 'app-mim-date-picker',
  templateUrl: './mim-date-picker.component.html',
  styleUrls: ['./mim-date-picker.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MimDatePickerComponent),
      multi: true
    }
  ]
})
export class MimDatePickerComponent implements ControlValueAccessor {

  @ViewChild('calendar')
  calendar: Calendar;
  /**
   * @description Id del input interno del componente.
   */
  @Input()
  inputId: string;

  /**
   * @description Fecha minima permitida por el componente.
   */
  @Input()
  minDate: any;

  /**
   * @description Fecha maxima permitida por el componente.
   */
  @Input()
  maxDate: any;

  @Input()
  showButtonBar = true;

  @Input()
  disabled: boolean;

  /**
   * @description Define la cantidad de la selección, los valores válidos son "single", "multiple" and "range"
   */
  @Input()
  selectionMode = 'single';

  @Input()
  readOnlyInput = true;

  @Input()
  timeOnly = false;

  @Input()
  showSeconds = false;

  es = ES;

  /**
   * @description Modelo del componente.
   */
  modelo: any;

  /**
   * @description Permite mantener seleccionadas las fechas especificadas en fechasAMantenerSeleccionadas. Falso por defecto.
   */
  @Input()
  mantenerFechasSeleccionadas = false;

  /**
   * @description Fechas a mantener seleccionadas si mantenerFechasSeleccionadas esta habilitado.
   */
  _fechasAMantenerSeleccionadas: Date[];

  /**
   * @description Se encarga de detectar cambios en el componente padre y actualizar el
   * modelo de mim-date-picket para las fechas seleccionadas.
   */
  @Input()
  set fechasAMantenerSeleccionadas(value: Date[]) {
    this._fechasAMantenerSeleccionadas = value;
  }

  @Output()
  // tslint:disable-next-line:no-output-on-prefix
  onChangeValue: EventEmitter<any> = new EventEmitter<any>();

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
   * Actualiza el modelo.
   * @param model Modelo del componente.
   */
  writeValue(modelo: any): void {
    if (this.modelo === modelo) {
      return;
    }

    // Creamos una copia para no modificar la referencia al valor en el componente padre.
    let modeloCopia = this.crearCopia(modelo);

    // Nos aseguramos que fechas a mantener seleeccionadas no contenga undefinidos ni nulos.
    this._fechasAMantenerSeleccionadas = this._fechasAMantenerSeleccionadas ?
      this._fechasAMantenerSeleccionadas.filter(item => item !== null && item !== undefined) :
      [];

    // Validamos si la opcion de bloquear fechas esta habilitada.
    if (this.mantenerFechasSeleccionadas && this._fechasAMantenerSeleccionadas
      && this._fechasAMantenerSeleccionadas.length !== 0) {
      modeloCopia = this.configurarFechasAMantenerSeleccionadas(modelo);
    }

    this.modelo = modeloCopia;
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
    this.writeValue(modelo);
  }

  _onCalendarChange(event: any) {
    const modelo = event;

    // Creamos una copia para no modificar la referencia al valor en el componente padre.
    let modeloCopia = this.crearCopia(modelo);

    // Nos aseguramos que fechas a mantener seleeccionadas no contenga undefinidos ni nulos.
    this._fechasAMantenerSeleccionadas = this._fechasAMantenerSeleccionadas ?
      this._fechasAMantenerSeleccionadas.filter(item => item !== null && item !== undefined) :
      [];

    // Validamos si la opcion de bloquear fechas esta habilitada.
    if (this.mantenerFechasSeleccionadas && this._fechasAMantenerSeleccionadas
      && this._fechasAMantenerSeleccionadas.length !== 0) {
      modeloCopia = this.configurarFechasAMantenerSeleccionadas(modelo);

      // IMPORTANTE** Solo asignamos en caso de que se deba mantener la seleccion de fechas.
      this.modelo = modeloCopia;
    }

    this.onChange(modeloCopia);
    this.onChangeValue.emit(modeloCopia);
  }


  private configurarFechasAMantenerSeleccionadas(modelo: any) {
    // Creamos una copia para no modificar la referencia al valor en el componente padre.
    let modeloCopia = this.crearCopia(modelo);

    // Inicializamos modelo para evitar errores con undefined.
    modeloCopia = modeloCopia || [];
    modeloCopia.unshift(...this._fechasAMantenerSeleccionadas);

    // Eliminamos nulos o indefinidos.
    modeloCopia = modeloCopia.filter(item => item !== null && item !== undefined);

    // Eliminamos los repetidos.
    modeloCopia = modeloCopia.filter((valorActual, indiceActual, arreglo) => {
      return arreglo.findIndex(valorDelArreglo =>
        JSON.stringify(valorDelArreglo) === JSON.stringify(valorActual)) === indiceActual;
    });

    // Realizamos el ordenamiento de las fechas.
    modeloCopia.sort((a, b) => a > b);

    // Deshabilitamos la seleccion de fechas antes de la primer fecha del nuevo modelo.
    if (modeloCopia.length !== 0) {
      this.minDate = modeloCopia[0];
    }

    return modeloCopia;
  }

  private crearCopia(modelo: any): any {
    let modeloCopia: any;
    if (modelo !== null && modelo !== undefined) {
      if (modelo instanceof Array) {
        modeloCopia = Object.assign([], modelo);

        // Eliminamos nulos o indefinidos.
        modeloCopia = modeloCopia.filter(item => item !== null && item !== undefined);
      } else {
        modeloCopia = modelo;
      }
    }

    return modeloCopia;
  }

}
