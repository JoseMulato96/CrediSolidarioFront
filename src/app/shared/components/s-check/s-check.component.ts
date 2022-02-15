import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";
import {
  BCheckComponent,
  CheckEnum
} from "../../extends-components/bcheck-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-check",
  templateUrl: "./s-check.component.html",
  styleUrls: ["./s-check.component.scss"]
})
export class SCheckComponent extends BCheckComponent implements OnInit {
  constructor(public http: HttpClient, public el: ElementRef) {
    super();
  }

  ngOnInit() {
    this.Skeleton.Type = this.Skeleton.Type || CheckEnum.Radio;
    this.EvtLoadItemsByStore.subscribe(items => {
      this._CkeckValueDefault();
    });
  }

  ngAfterContentInit() {
    this.ApplyItemsStore(this.http);
  }

  ngAfterViewInit() {
    this._CkeckValueDefault();
  }

  /**
   * 
   * @description valida si hay componente para selecionar por defecto
   */
  _CkeckValueDefault(): any {
    if (
      this.Skeleton.SelectIndex != -1 &&
      this.Skeleton.SelectIndex != undefined &&
      this.Skeleton.Items &&
      this.Skeleton.Items.length
    ) {
      let exist = this.Skeleton.Items[this.Skeleton.SelectIndex];
      exist && this.ChangeState(exist);
    } else if (this.Skeleton.SelectValue) {
      let exist = (this.Skeleton.Items || []).find(
        x => x["Value"] == this.Skeleton.SelectValue
      );
      exist && this.ChangeState(exist);
    }
  }

  /**
   * r
   * @description disable el componente
   * @param disable
   */
  SetDisable(disable: boolean) {
    this._Disable = !!disable;
  }

  /**
   * r
   * @description Obtiene la data del componente con el valor value
   */
  GetData(): any {
    if (this.Skeleton.Type == CheckEnum.Check) {
      return this._Values[0] ? this._Values[0].Value : "";
    }
    return this.Skeleton.Data ? this.Skeleton.Data["Value"] : "";
  }

  /**
   * r
   * @description Obtiene la data del componente con el valor label
   */
  GetDataLabel(): any {
    if (this.Skeleton.Type == CheckEnum.Check) {
      return this._Values[0] ? this._Values[0].Value : "";
    }
    return this.Skeleton.Data ? this.Skeleton.Data["Label"] : "";
  }

  /**
   * r
   * @description seleciona el valor
   * @param value object que debe tener value
   */
  SetData(value: any) {
    this.ChangeState(
      this.Skeleton.Items.find(x => x["Value"] == value["Value"])
    );
  }

  /**
   * 
   * @description Selecciona el dato buscandolo por el Valor
   * @param value
   */
  SelectByValue(value: any): any {
    if (!this.Skeleton.Items) {
      this.EvtLoadItemsByStore.subscribe(x => {
        this.SelectByValue(value);
      });
      return;
    }
    let data = this.Skeleton.Items.find(x => x["Value"] == value);
    data && this.SetData(data);
    data && this.ApplyState(data);
  }

  /**
   * r
   * @description desabilita el valor del item
   * @param
   */
  ItemDisableByValue(value: number): any {
   
    if (!this.Skeleton.Items) {
      this.EvtLoadItemsByStore.subscribe(x => {
        this.ItemDisableByValue(value);
      });
      return;
    }
    let data = this.Skeleton.Items.find(x => x["Value"] == value);
    data && (data._Disable = true);
  }

  /**
   * r
   * @description Cambio el estado de los checks
   * @param item
   */
  ChangeState(item) {
    super.ChangeState(item);
  }

  _itemCheck: boolean = false;

  /**
   * r
   * @description Obtiene si esta chequeado el componente al menos uno
   */
  _GetIsCheck() {
    let item = this._Values[0];
    item && this.ApplyState(item);
    this._itemCheck = item && item._Select;
    return this._itemCheck;
  }

  /**
   * rs
   * @description checka el html el componente check o radio button
   * @param item
   */
  ApplyState(item) {
    let inputElements = this.el.nativeElement;
    let inputEl = inputElements.getElementsByTagName("input");
    let pos = this.Skeleton.Items.findIndex(x => (x.Id = item.Id));
    if (pos != -1) {
      inputEl[pos].checked = Boolean(item._Select);
    }
  }
}
