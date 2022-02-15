import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Modal } from "ngx-modal";
import {
  BinputComponent,
  InputModel
} from "../../extends-components/binput-component";
import { Utils } from "../../../utils/utils";
import {
  AddressTypeRoadStore,
  AddressTypeZoneStore,
  AddressTypeInsideStore,
  AddressTypeInmueblesStore
} from "../../../store/address-type-road-store";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-address",
  templateUrl: "./s-address.component.html",
  styleUrls: ["./s-address.component.scss"]
})
export class SAddressComponent extends BinputComponent implements OnInit {
  @ViewChild(Modal)
  modelAddress: Modal;

  constructor(public http: HttpClient) {
    super(http);
  }

  ngOnInit() {
    this.modelAddress.hideCloseButton = false;
  }

  Skeleton: InputAddresModel;
  StreetValue: string[] = [];
  SwitchBtn: boolean = false;
  ValueTemporal: string = "";

  FieldTypeStreets = {
    Label: "",
    ItemsByStore: AddressTypeRoadStore.name
  };
  FieldStreetsDetail: InputModel = {
    Label: "",
    Items: [{}],
    LenMaxValue: 7
  };
  FieldOrientation = {
    Label: "",
    ItemsByStore: AddressTypeZoneStore.name
  };
  FieldOrientationDetail = {
    Label: "",
    Items: [{}],
    LenMaxValue: 7
  };
  FieldOrientationDetail2 = {
    Label: "",
    Items: [{}],
    LenMaxValue: 7
  };
  FieldUnidad = {
    Label: "",
    ItemsByStore: AddressTypeInmueblesStore.name
  };
  FieldUnidadDetail = {
    Label: "",
    Items: [{}],
    LenMaxValue: 7
  };
  FieldBloque = {
    Label: "",
    ItemsByStore: AddressTypeInsideStore.name
  };
  FieldBloqueDetail = {
    Label: "",
    Items: [{}],
    LenMaxValue: 7
  };

  FieldInfoAdd = {
    Label: "",
    Placeholder: "Info. Adicional",
    Items: [{}],
    LenMaxValue: 50
  };

  /**
   * 
   * @description Valida los dos campos
   */
  Valid() {
    let isValid = true;

    this._PatternMessage = "";
    if (!this.Skeleton.IsRequired) {
      return isValid;
    }
    // valor del barrio
    let neighborhood = this.Skeleton.Data || "";
    // valor de la dirección
    let address = this.Skeleton.Data2 || "";

    if (!neighborhood) {
      this.ApplyCssRequired(this._Css);
      isValid = false;
    } else {
      isValid = true;
      this._Css = this.RemoveCssRequired(this._Css);
    }
    if (!address) {
      this.ApplyCssRequired(this._Css2);
      isValid = false;
    } else {
      isValid = true;
      this._Css2 = this.RemoveCssRequired(this._Css2);
    }
    return isValid;
  }

  _Css: string[] = [];

  _Css2: string[] = [];

  _CssRequired: string = "input-required";

  /**
   * @description Se le agrega el css requerido
   * @param css
   */
  ApplyCssRequired(css: string[]) {
    !css.find(x => x == this._CssRequired) && css.push(this._CssRequired);
  }

  /**
   * @description Se remueve el css el requerido
   * @param css
   */
  RemoveCssRequired(css: string[]) {
    return css.filter(x => x != this._CssRequired);
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
   * @description Agrega los css privados o internos de la aplicacion
   */
  GetCss2Private() {
    return " " + this._Css2.join(" ");
  }

  /**
   * 
   * @description Obtener el barrio
   * */
  GetDataNeighborhood(): string {
    return this.Skeleton.Data;
  }

  /**
   * 
   * @description Obtener la direccion
   * */
  GetDataAddress(): string {
    return this.Skeleton.Data2;
  }

  /**
   * 
   * @description Estableser la direccion
   * @param data
   */
  SetDataAddress(data: string): any {
    this.Skeleton.Data2 = data;
  }

  /**
   * 
   * @description Estableser la barrio
   * @param data
   */
  SetDataNeighborhood(data: string): any {
    this.Skeleton.Data = data;
  }

  /**
   * 
   * @description Posiciona el valor en Data2 de Skeleton
   * @param value objecto
   * @param pos index
   */
  OnStreets(value, pos) {
    this.StreetValue = this.StreetValue || [];
    this.StreetValue[pos] = typeof value == "string" ? value : value.Value;
    this.ApplycationValue();
  }

  /**
   * r
   * @description escucha cuando va actualizar la información de la dirección
   */
  OnClickCurrent() {
    this.StreetValue = [];

    this.modelAddress.open();
    //
    this.FieldTypeStreets["Data"] = undefined;
    this.FieldStreetsDetail["Data"] = undefined;
    this.FieldOrientation["Data"] = undefined;
    this.FieldOrientationDetail["Data"] = undefined;
    this.FieldOrientationDetail2["Data"] = undefined;
    this.FieldUnidad["Data"] = undefined;
    this.FieldUnidadDetail["Data"] = undefined;
    this.FieldBloque["Data"] = undefined;
    this.FieldBloqueDetail["Data"] = undefined;
    this.FieldInfoAdd["Data"] = undefined;
    //
    this.modelAddress.onClose.subscribe(() => {
      this.ValueTemporal = "";
    });
  }

  /**
   * 
   * @description Guarda el dato
   */
  ClickComfirm() {
    this.modelAddress.close();
    this.Skeleton.Data2 = this.StreetValue.join(" ") || "";
    this.Skeleton.Data2 = Utils.RemoveMoreSpace(this.Skeleton.Data2);
    this.StreetValue = [];
    this.Valid();
  }

  /**
   * 
   * @description Muestra o oculta los datos
   */
  ClickVisibleModeFields() {
    this.SwitchBtn = !this.SwitchBtn;
    if (!this.SwitchBtn) {
      this.FieldUnidad["Data"] = undefined;
      this.FieldUnidadDetail["Data"] = undefined;
      this.FieldBloque["Data"] = undefined;
      this.FieldBloqueDetail["Data"] = undefined;
      this.FieldInfoAdd["Data"] = undefined;
      this.OnStreets("", 5);
      this.OnStreets("", 6);
      this.OnStreets("", 7);
      this.OnStreets("", 8);
      this.OnStreets("", 9);
      this.OnStreets("", 10);
    }
  }

  /**
   * r
   * @description une el contenido de las direccion y lo coloca en un extructura
   */
  ApplycationValue() {
    this.ValueTemporal = this.StreetValue.join(" ") || "";
    this.ValueTemporal = Utils.RemoveMoreSpace(this.ValueTemporal);
  }
}

export class InputAddresModel extends InputModel {
  public Data: string = "";
  public Data2: string = "";
  public Placeholder: string = "Barrio: Ej Peñon";
  public Placeholder2: string = "Av 1 con calle 100";
}
