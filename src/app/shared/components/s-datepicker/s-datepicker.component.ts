import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from "@angular/core";
import { BinputComponent, InputModel } from "../../extends-components/binput-component";
import { MesaggeText } from "../../texts/mesagge-text";
import { Platform } from '@angular/cdk/platform';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';



// here is the default text string
export class SpanishIntl {



  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'agrega un segundo';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'menos un segundo';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'agrega un minuto';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'menos de un minuto';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'agrega una hora';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'menos de una hora';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'Mes anterior';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'Proximo mes';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'Año anterior';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'Proxima año';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = '21 años anteriores';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Proximos 21 años';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Cambie a vista de mes';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Escoja mes y año';

  /** A label for the cancel button */
  cancelBtnLabel = 'Cancelar';

  /** A label for the set button */
  setBtnLabel = 'Confirmar';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'De';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'a';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}


@Component({
  selector: "s-datepicker",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./s-datepicker.component.html",
  styleUrls: ["./s-datepicker.component.scss"], providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {
      provide: OWL_DATE_TIME_LOCALE, useValue:
      {
        // parseInput: "dd mm yyyy",
        // fullPickerInput: "dd mm yyyy",
        // datePickerInput: "dd mm yyyy",
        parseInput: 'DD MM YYYY',
        fullPickerInput: 'DD MM YYYY',
        datePickerInput: 'DD MM YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
      }
      //  'gb'
    },
    { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE, Platform] },
    { provide: OwlDateTimeIntl, useClass: SpanishIntl },
  ],
})
export class SDatepickerComponent extends BinputComponent implements OnInit {
  constructor(public http: HttpClient) {
    super(http);
  }

  ngOnInit() {

  }

  Skeleton: DatePickerModel;
  _Min: any
  _Max: any

  ngAfterContentInit() {
    this.ApplyItemsStore(this.http);

    if (this.Skeleton.Behavior == DatePickerBehaviorEnum.DateMinCurrent) {
      this._Min = new Date();
    }
    if (this.Skeleton.Behavior == DatePickerBehaviorEnum.DateMaxCurrent) {
      this._Max = new Date();
    }
    if (this.Skeleton.Behavior == DatePickerBehaviorEnum.DateMinOld) {
      let date = new Date();
      date.setFullYear(new Date().getFullYear() - 18);
      this._Max = date.toJSON().split("T")[0];
    }
  }


  _GetDataPrivate(evt) {
    let dateValue: string = (evt.target.value || "");;
    let dateArray: string[] = dateValue.split("/");
    if (dateArray.length === 3 && dateArray[2] && dateArray[2].length == 4) {
      this.Skeleton.Data = new Date(
        parseInt(dateArray[2]),
        parseInt(dateArray[1]) - 1,
        parseInt(dateArray[0])
      );
      this.Valid();
    }

  }

  @Output()
  changeValue:EventEmitter<any> = new EventEmitter<any>()
  
  _SelectDateInCalendar(target) {
    if (this._Disable) {
      return;
    }
    this.changeValue.emit({value: target.value})
    this.Skeleton.Data = target.value;
    this.Valid();
  }

  /**
   * 
   * @description Valida si es requerido y si cumple los requerimientos
   */
  public Valid() {
    this._PatternMessage = "";
    this.InactivityInputRequired();

    let value: any = this.Skeleton.Data;

    /// se valida de esta forma el numero cero para pasarlo a string.




    if (!this.Skeleton.IsRequired) {
      return true;
    }
    let apply = false;

    if (!apply && this.Skeleton.Behavior === DatePickerBehaviorEnum.DateMaxCurrent) {
      let date = new Date();
      let isMax = (value != null && value <= date); this._PatternMessage = isMax
        ? ""
        : MesaggeText.TEXT_DATE_CURRENT_MIN
        ;
      apply = !isMax;
    }

    if (!apply && !value) {
      apply = true;
      this._PatternMessage = MesaggeText.TEXT_DATE_ERROR;
    }


    else if (!apply && this.Skeleton.Behavior === DatePickerBehaviorEnum.DateMinCurrent) {
      let date = new Date();
      let isMin = (value != null && value >= date);
      this._PatternMessage = isMin
        ? ""
        : MesaggeText.TEXT_DATE_CURRENT_MAX
        ;
      apply = !isMin;
    }

    else if (!apply && this.Skeleton.Behavior === DatePickerBehaviorEnum.DateMinOld) {
      let date = new Date();
      date.setFullYear(new Date().getFullYear() - 18);
      this._Max = date.toJSON().split("T")[0];

      let isOld = (value != null && value <= date);

      this._PatternMessage = isOld
        ? ""
        : MesaggeText.TEXT_DATE_MIN_OLD
        ;
      apply = !isOld;
    }

    if (!apply && this.Skeleton.ValidateCustomen) {
      let valid = this.Skeleton.ValidateCustomen(value);
      apply = !valid;
    }

    if (apply) {
      this.ApplyInputRequired();
    } else {
      this.InactivityInputRequired();
    }

    return !apply;
  }

  GetData(): any {
    let value: any = this.Skeleton.Data;
    value = new Date(this.Skeleton.Data);
    value.setDate(value.getDate());
    value = value.getTime();

    return value;
  }

  /**
 * 
 * @description Estableser el Valor
 */
  SetData(data: any) {
    if (data) {
      data = new Date(data);
      data.setDate(data.getDate());
      // data = data.toJSON().split("T")[0];
    } else if (!data) {
      data = undefined;
    }
    this.Skeleton.Data = data;
  }


  /**
 * 
 * @description esta funcionalidad es solo para fecha de diligenciamiento en autorizaciones
 */
  SetDataCurrent(data: any) {
    if (data) {
      data = new Date(data);
      data.setDate(data.getDate());
      // data = data.toJSON().split("T")[0];
    } else if (!data) {
      data = undefined;
    }
    this.Skeleton.Data = data;
  }
}

export class DatePickerModel extends InputModel {
  public Data?: any = 0;
  public Behavior?: DatePickerBehaviorEnum = DatePickerBehaviorEnum.Normal
}

export enum DatePickerBehaviorEnum {
  Normal = "normal",
  DateMinCurrent = "dateMinCurrent",
  /**
   * bloquear los dias maximos
   */
  DateMaxCurrent = "dateMaxCurrent",
  /**
   * ser mayor de edad
   */
  DateMinOld = "dateMinOld",
}


