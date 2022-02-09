import { BaseModel } from "./base-component";
import { BSwitchComponent } from "./bswitch-component";

export class BCheckComponent extends BSwitchComponent {
  constructor() {
    super();
  }

  Skeleton: CheckModel = new CheckModel();
  _Disable: boolean;
  /**
   * @author Jorge Luis Caviedes ALvarado
   * @description cambia los estados
   */
  ChangeState(item) {
    if (this._Disable || item._Disable) {
      return;
    }
    if (this.Skeleton.Type == CheckEnum.Check) {
      item._Select = !item._Select;
      if (item._Select) {
        this._Values.push(item);
      } else {
        let index = this._Values.findIndex(
          x => x.Value == item.Value || x.Label == item.Label
        );
        index != -1 && this._Values.splice(index, 1);
      }
    } else if (this.Skeleton.Type == CheckEnum.Radio) {
      this._Value._Select = false;
      this._Value = item;
      this._Value._Select = true;
      this.Skeleton.Data = this._Value;
    }

    // se notifica a todos los componentes inscritos
    this.EvtChangeState.emit(item);
  }

  Clear(): any {
    if (this._Value) {
      this._Value._Select = false;
    }
  }

  _Values: any[] = [];

  _AssignProperty(items: any[]) {
    items.forEach(x => {
      // x.Id = x.Id || Utils.GeneralId();
      x._Select = x._Select || false;
    });
  }
}

export class CheckModel extends BaseModel {
  public Type: CheckEnum = CheckEnum.Check;
  public Data?: any;
  public NameGroup?: string = "";
  public Items?: any[] = [];
  public SelectIndex?: number = -1;
  public SelectValue?: any = undefined;
  public _Select?: boolean = false;
  public ReadOnly?: boolean = false;
}

export enum CheckEnum {
  Check = "checkbox",
  Radio = "radio"
}
