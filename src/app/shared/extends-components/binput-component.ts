import { HttpClient } from "@angular/common/http";
import { EventEmitter, OnInit, Output, Input } from "@angular/core";
import { MesaggeText } from "../texts/mesagge-text";
import { BaseComponent, BaseModel } from "./base-component";

export class BinputComponent extends BaseComponent implements OnInit {
  Skeleton: InputModel;
  public static currentDate = new Date().getTime();

  public static Adult() {
    let date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    date.setHours(0);
    date.setMilliseconds(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
  }

  public static FetchExpedition() {
    let date = new Date(this.Adult());
    date.setFullYear(date.getFullYear() + 18);
    return date.getTime();
  }
  constructor(public http: HttpClient) {
    super();
  }

  ngOnInit(): void {}

  /**
   * r
   * @description el sistema realiza las siguientes validaciones y ejecucion de item store
   */
  ngAfterContentInit() {
    this.ApplyItemsStore(this.http);
    this.Skeleton.Type = this._Type = this.Skeleton.Type || InputEnum.Text;
    // if (this.Skeleton.Type == InputEnum.DateMinCurrent) {
    //   this._Type = InputEnum.Date;
    //   this._Min = new Date().toJSON().split("T")[0];
    // }
    // if (this.Skeleton.Type == InputEnum.DateMaxCurrent) {
    //   this._Type = InputEnum.Date;
    //   this._Max = new Date().toJSON().split("T")[0];
    // }
    // if (this.Skeleton.Type == InputEnum.DateMinOld) {
    //   this._Type = InputEnum.Date;
    //   let date = new Date();
    //   date.setFullYear(new Date().getFullYear() - 18);
    //   this._Max = date.toJSON().split("T")[0];
    // }
  }

  @Output()
  evttyping: EventEmitter<any> = new EventEmitter<any>();
  _Max: string;
  _Min: string;
  _PatternMessage: string = "";

  /**
   * 
   * @description Escuchar cuando se escribe en el componente
   * @param value
   */
  OnTyping(value) {
    this.Skeleton.Data = value;
    this.evttyping.emit(value);
  }

  /**
   * 
   *
   * @description Escuchar evento cuando pierde el focus
   */
  public OnBlur(e) {
    this.Valid();
    this.evtBlur.emit(this);
  }

  @Output() evtBlur: EventEmitter<any> = new EventEmitter<any>();

  /**
   * 
   * @description Obtener el Valor
   */
  GetData(): any {
    let value: any = this.Skeleton.Data;
    // if (this._Type == InputEnum.Date) {
    //   value = new Date(this.Skeleton.Data);
    //   value.setDate(value.getDate() + 1);
    //   value = value.getTime();
    // }

    return value;
  }

  /**
   * r
   * @description Habilita o desabilidata el componente
   * @param value
   */
  SetReadOnly(value: boolean): any {
    this.Skeleton.ReadOnly = value;
  }

  /**
   * 
   * @description Estableser el Valor
   */
  SetData(data: any) {
    // if (this._Type == InputEnum.Date && data) {
    //   data = new Date(data);
    //   data.setDate(data.getDate() - 1);
    //   data = data.toJSON().split("T")[0];
    // } else if (this._Type == InputEnum.Date && !data) {
    //   data = undefined;
    // }
    this.Skeleton.Data = data;
  }

  // /**
  //  * 
  //  * @description esta funcionalidad es solo para fecha de diligenciamiento en autorizaciones
  //  */
  // SetDataCurrent(data: any) {
  //   if (this._Type == InputEnum.Date && data) {
  //     data = new Date(data);
  //     data.setDate(data.getDate());
  //     data = data.toJSON().split("T")[0];
  //   } else if (this._Type == InputEnum.Date && !data) {
  //     data = undefined;
  //   }
  //   this.Skeleton.Data = data;
  // }

  /**
   * 
   * @description Limpia la selecion
   */
  Clear() {
    this.Skeleton.Data = undefined;
    this._PatternMessage = "";
  }

  /**
   * r
   * @description si se establece el focu en el componente quita cualquier css de requerido
   */
  public OnFocus(e) {
    this.InactivityInputRequired();
  }

  /**
   * 
   * @description Valida si es requerido y si cumple los requerimientos
   */
  public Valid() {
    this._PatternMessage = "";
    this.InactivityInputRequired();
    /// se valida de esta forma el numero cero para pasarlo a string.
    let value = (
      (this.Skeleton.Data == "0" ? "0" : this.Skeleton.Data) || ""
    ).toString();

    if (!this.Skeleton.IsRequired) {
      return true;
    }

    let apply = false;

    if (this._Type == InputEnum.Text) {
      value = (value || "").trim();
      apply = !value;
    }
    // else if (this._Type == InputEnum.Date) {
    //   apply = !value;
    // }
    else if (this._Type == InputEnum.Email) {
      apply = !value;
    } else if (this._Type == InputEnum.Phone) {
      apply = !value;
    }
    // if (this._Type == InputEnum.Date && !apply) {
    //   let valueDate = this.GetData();
    //   let dateMax = new Date(valueDate);
    //   dateMax.setHours(0);
    //   dateMax.setMinutes(0);
    //   dateMax.setSeconds(0);
    //   dateMax.setMilliseconds(0);
    //   if (this.Skeleton.ValueMax < dateMax.getTime()) {
    //     apply = true;
    //     this._PatternMessage = MesaggeText.TEXT_MESSAGE_SERNIODATE;
    //   }
    // }
    if (!apply && this.Skeleton.LenMax) {
      let validReg = value.length <= this.Skeleton.LenMax;
      this._PatternMessage = validReg
        ? ""
        : MesaggeText.LEN_MAX_CHAR.replace(
            "{0}",
            this.Skeleton.LenMax.toString()
          );
      apply = !validReg;
    }

    if (!apply && this.Skeleton.LenMin) {
      let validReg = value.length >= this.Skeleton.LenMin;
      this._PatternMessage = validReg
        ? ""
        : MesaggeText.LEN_MIN_CHAR.replace(
            "{0}",
            this.Skeleton.LenMin.toString()
          );
      apply = !validReg;
    }

    if (!apply && this.Skeleton.ValueMax) {
      let validReg = parseFloat(value || "0") <= this.Skeleton.ValueMax;
      this._PatternMessage = validReg
        ? ""
        : MesaggeText.VALUE_MAX_CHAR.replace(
            "{0}",
            this.Skeleton.ValueMax.toString()
          );
      apply = !validReg;
    }

    if (!apply && this.Skeleton.ValueMin) {
      let validReg = parseFloat(value || "0") >= this.Skeleton.ValueMin;
      this._PatternMessage = validReg
        ? ""
        : MesaggeText.VALUE_MIN_CHAR.replace(
            "{0}",
            this.Skeleton.ValueMin.toString()
          );
      apply = !validReg;
    }

    if (!apply && this.Skeleton.Pattern) {
      let validReg = RegExp(this.Skeleton.Pattern.exp).test(value);
      this._PatternMessage = validReg ? "" : this.Skeleton.Pattern.message;
      apply = !validReg;
    }

    if (this.Skeleton.ValidateCustomen) {
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

  /**
   * r
   * @description agrega el css al componente como requerido
   */
  ApplyInputRequired() {
    this._Css.push("input-required");
  }

  /**
   * r
   * @description remoeve el css del componente como requerido
   */
  public InactivityInputRequired() {
    this._Css = this._Css.filter(x => x != "input-required");
  }

  /**
   * 
   * @description Agrega los css privados o internos de la aplicacion
   */
  GetCssPrivate() {
    return " " + this._Css.join(" ");
  }

  /**
   * 
   * @description Agrega si es requerido o no
   */
  SetRequired(required:boolean){
    this.Skeleton.IsRequired = required;
  }

  set(text:string ){
    this._PatternMessage = text;
  }
}

export class InputModel extends BaseModel {
  public Type?: string = InputEnum.Text;
  public Data?: string = "";
  public Placeholder?: string = "";
  public LenMin?: number = -Infinity;
  public LenMax?: number = Infinity;
  public ValueMin?: number = -Infinity;
  public ValueMax?: number = Infinity;
  public Pattern?: any;
  public ReadOnly?: boolean = false;
  public IsCurrency?: boolean = false;
  public Disable?: boolean = false;
  public LenMaxValue?: number = 10000000;
  public Symbol?: string = "*";
  public ValidateCustomen?: Function;
}

export enum InputEnum {
  Text = "text",
  // Date = "date",
  // DateMinCurrent = "dateMinCurrent",
  // DateMaxCurrent = "dateMaxCurrent",
  // /**
  //  * mayor de edad
  //  */
  // DateMinOld = "dateMinOld",
  Password = "password",
  Number = "number",
  Email = "email",
  Phone = "phone"
}
