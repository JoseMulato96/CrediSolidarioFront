import { HttpClient } from "@angular/common/http";
import { EventEmitter, Input } from "@angular/core";
import { BaseStore } from "../../extends/base-store";
import { ListOfStore } from "../../store/list-of-store";
import { Utils } from "../../utils/utils";
import { TooltipModel } from "../components/s-tooltip/s-tooltip.component";

export class BaseComponent {
  constructor() {
    this._AddItems(this.Skeleton.Items);
    this.Skeleton.Id = Utils.GeneralId();
  }

  @Input("skeleton")
  Skeleton: BaseModel = new BaseModel();
  EvtLoadItemsByStore: EventEmitter<any> = new EventEmitter<any>();

  _Css: string[] = [];
  _Disable: boolean;
  _Type: string = "";

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Overwritter para lo demás componentes
   *  */
  Valid(): boolean {
    return true;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description cambiar el estado si es disable
   * @param disable
   */
  SetDisable(disable: boolean): any {
    this._Disable = !!disable;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Buscar por servicio
   * @param http
   */
  public ApplyItemsStore(http: HttpClient) {
    if (this.Skeleton.ItemsByStore) {
      let s: BaseStore = ListOfStore.GetStore(this.Skeleton.ItemsByStore, http);

      if (this.Skeleton.FunctionStore) {
        s[this.Skeleton.FunctionStore]().then(x => {
          this._AddItems(x);
        });
      } else {
        s.newData().then(x => {
          this._AddItems(x);
        });
      }
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description filtra los elemento que no va contener en la configuracion de skeleton
   * @param items elementos a filtrar
   */
  protected _FilterItems(items: any) {
    let newItems = items;
    if (this.Skeleton.ItemsFilterByValue) {
      newItems = items.filter(x => {
        let a = this.Skeleton.ItemsFilterByValue.indexOf(x["Value"]) == -1;
        return a;
      });
    }
    return newItems;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description agrega al skeleton los items
   * @param items
   */
  protected _AddItems(items: any[]) {
    let newItems = this._FilterItems(items);

    this._AssignProperty(newItems);
    this.Skeleton.Items = newItems || [];
    if (this.Skeleton.VisibleOptionNone) {
      this.Skeleton.Items.push({
        Label: this.Skeleton.LabelOptionNone,
        Value: this.Skeleton.ValueOptionNone
      });
    }
    this.EvtLoadItemsByStore.emit(this.Skeleton.Items);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description asigna el id si lo tiene lo ignora
   * @param items
   */
  protected _AssignProperty(items: any[]) {
    items.forEach(x => {
      x.Id = x.Id || Utils.GeneralId();
    });
  }
}

export class BaseModel {
  public Label: string;
  public Question?: string = "";
  public Data?: any;
  public IsRequired?: boolean;
  public Id?: string = "";
  public Items?: any[] = [];
  public ItemsByStore?: string;
  public ItemsFilterByValue?: number[];
  public Hidden?: boolean = false;
  public FunctionStore?: string;
  public VisibleOptionNone?: boolean = false;
  public LabelOptionNone?: string = "Ninguno";
  public ValueOptionNone?: any = -Infinity;
  public Tooltip?: TooltipModel;
}
