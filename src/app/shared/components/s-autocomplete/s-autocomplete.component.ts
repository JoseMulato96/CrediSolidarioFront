import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { BaseStore } from "../../../extends/base-store";
import { ListOfStore } from "../../../store/list-of-store";
import {
  BinputComponent,
  InputModel
} from "../../extends-components/binput-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-autocomplete",
  templateUrl: "./s-autocomplete.component.html",
  styleUrls: ["./s-autocomplete.component.scss"]
})
export class SAutocompleteComponent extends BinputComponent implements OnInit {
  constructor(public http: HttpClient, public el: ElementRef) {
    super(http);
  }

  Skeleton: AutocompleteModel;
  _OptionParamterStore: any;
  _ValueForDelay: string = "";
  _StopDelay: boolean = false;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description realiza la configuración con base a Skeleton y dar los valores por default si no los contiene
   */
  ngOnInit() {
    this._Elements = this.Skeleton.Items || [];
    this.Skeleton.Placeholder = this.Skeleton.Placeholder || "Seleccionar";
    this._OptionParamterStore = this.Skeleton.DefaultOptionParamterStore || {};
    this._IsItemLoad = !!this.Skeleton.ItemsByStore;
    this.Skeleton.Delay = this.Skeleton.Delay || 1000;
    this.EvtLoadItemsByStore.subscribe(() => {
      this._IsItemLoad = false;
      this._Elements = this.Skeleton.Items || [];
      this._OrderByLabel();
    });
    this._OrderByLabel();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si hay que bloquear el componente
   */
  ngAfterContentInit() {
    super.ngAfterContentInit();
    if (this.Skeleton.Lock) {
      this.SetDisable(this.Skeleton.Lock);
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Disable componente
   * @param value
   */
  SetDisable(value) {
    value = !!value;
    super.SetDisable(value);
    this.Skeleton.ReadOnly = value;
    this._Disable = value;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Organiza la lista en forma alfabetica
   */
  _OrderByLabel() {
    if (this._Elements) {
      this._Elements = this._Elements.sort((a: any, b: any) =>
        a.Label > b.Label ? 1 : 0
      );
    }
  }

  IsApplyItemsStore() { }

  _Value: any = {};
  _Elements = [];
  _IsItemLoad: boolean = false;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida si cumple con el dato
   */
  Valid(): boolean {
    this._PatternMessage = "";
    this.InactivityInputRequired();
    if (!this.Skeleton.IsRequired) {
      return true;
    }
    let apply: boolean = false;
    let value: any = this.Skeleton.Data;
    apply = !this._Elements.find(
      x => x.Value == (value ? value.Value : undefined)
    );
    if (apply) {
      super.ApplyInputRequired();
    } else {
      super.InactivityInputRequired();
    }
    return !apply;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el dato del componente
   */
  GetData() {
    return this.Skeleton.Data ? this.Skeleton.Data["Value"] : undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Obtener el label del componente
   */
  GetLabel() {
    return this.Skeleton.Data ? this.Skeleton.Data["Label"] : "";
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description se agrega el item a la lista de items
   * @param item
   */
  AddItem(item: any) {
    this.Skeleton.Items = this.Skeleton.Items || [];
    this.Skeleton.Items.push(item);
    this._Elements = this._Elements || [];
    this._Elements.push(item);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
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
    let data = this.Skeleton.Items.find(x => x.Value == value);
    data && (this.Skeleton.Data = data);
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escuchando la escritura
   * @param value
   */
  OnTyping(value) {
    super.OnTyping(value);
    this.ListenWritingInput(value);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description se guarda el valor que se le pasa por parametro para luego pasarcelo _Delay como parametro en la solicitud del servicio, es comun cuando se requiere filtrar o buscar las ciudades de un pais que fue selecionado en otro componente y se le paso el valor por esta funcion
   * @param value
   */
  OptionParamterStore(value: any): any {
    this._OptionParamterStore = value;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Mandando por la funcion el valor
   * @param value
   */
  ListenWritingInput(value: string) {
    this._ValueForDelay = value;
    this._StopDelay = false;
    this._Delay(value);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description activa la vandera para indicar que no vuelva a buscar con el _Delay y no hacer ningun servcio
   */
  _OnSelectValueOf(value) {
    this._StopDelay = true;
    return value;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida despues de un tiempo si el usuario al escribir hay que hacer la solicitud de algun servicio store
   * y luego llenar en la lista con el contenido retornado
   * @param value
   */
  _Delay(value: string) {
    if (
      typeof value == "string" &&
      this.Skeleton.MinChars != 0 &&
      this.Skeleton.MinChars > value.length
    ) {
      return;
    }

    if (this._StopDelay || typeof value != "string") {
      return;
    }
    setTimeout(() => {            
      if (this._ValueForDelay == value) {        
        this._StopDelay = true;
        if (this.Skeleton.IsActionWrittenStore) {          
          this._IsItemLoad = true;
          this._BaseStore[this.Skeleton.FunctionStore](
            value,
            this._OptionParamterStore || {}
          ).then(x => {
            this.Skeleton.Items = [];
            this.Skeleton.Items = x;
            this._Elements = x;
            let inputElements = this.el.nativeElement;
            let inputEl = inputElements.getElementsByTagName("input");
            /// quita el focus de input 0 para colocarlo en el input 1 y asi poder recargar nuevamnete la lista
            /// Se realizo este metodo porque el componente cuando se le adiciona los nuevos registro no abre el
            /// diplay
            inputEl[1].focus();
            setTimeout(() => inputEl[0].focus(), 10);
            this._IsItemLoad = false;
          });
        }
      } else {
        this._Delay(value);
      }
    }, this.Skeleton.Delay);
  }

  _BaseStore: BaseStore;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Buscar por servicio
   * @param http
   */
  public ApplyItemsStore(http: HttpClient) {
    if (this.Skeleton.ItemsByStore) {
      let s: BaseStore = ListOfStore.GetStore(this.Skeleton.ItemsByStore, http);

      if (this.Skeleton.FunctionStore && this.Skeleton.IsActionWrittenStore) {
        this._BaseStore = s;
        this.EvtLoadItemsByStore.emit([]);
        return;
      }

      if (this.Skeleton.SelectValue != undefined) {
        s.newData().then(x => {
          this.Skeleton.Items = this._FilterItems(x);
          this.EvtLoadItemsByStore.emit(this.Skeleton.Items);
        });
        this.SelectByValue(this.Skeleton.SelectValue)
      }

      if (this.Skeleton.FunctionStore) {
        s[this.Skeleton.FunctionStore]("", this._OptionParamterStore).then(
          x => {
            this.Skeleton.Items = this._FilterItems(x);
            this.EvtLoadItemsByStore.emit(this.Skeleton.Items);
          }
        );
      } else {

        s.newData().then(x => {
          this.Skeleton.Items = this._FilterItems(x);
          this.EvtLoadItemsByStore.emit(this.Skeleton.Items);
        });
      }
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Mostrar la lista de datos
   */
  OnClickIcon() {
    if (this.Skeleton.ReadOnly) {
      return;
    }
    /**
     * Se obtiene el input y asignarle el focus para que despliegue la lista
     */
    let inputElements = this.el.nativeElement;
    let inputEl = inputElements.getElementsByTagName("input");
    inputEl[0].focus();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtener los minimos carateres para escribir
   */
  _GetMinChars() {
    return this.Skeleton.MinChars || 0;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description obtener la cantidad minima de items
   */
  _LenItems() {
    return this.Skeleton.LenMaxItem || 10;
  }

  /**
   * @author Toshiro Alejandro Kuratomi
   * @description Filtrar items
   */
  public FilterByItems(items: any[]) {
    this.Skeleton.ItemsFilterByValue = items;
    let newItems = this._FilterItemsRemove(this.Skeleton.Items);
    this._AssignProperty(newItems);
    this._Elements = newItems || [];
  }

  /**
   * @author Toshiro Alejandro Kuratomi
   * @description Remover items ingresados
   */
  protected _FilterItemsRemove(items: any) {
    let newItems = items;
    if (this.Skeleton.ItemsFilterByValue) {
      newItems = items.filter(x => {
        let a = this.Skeleton.ItemsFilterByValue.indexOf(x["Value"]) != -1;
        return a;
      });
    }
    return newItems;
  }

}

export class AutocompleteModel extends InputModel {
  public IsActionWrittenStore?: boolean;
  public DefaultOptionParamterStore?: any;
  public Delay?: number = 1000;
  public ModeDropDown?: boolean = false;
  public MinChars?: number = 0;
  public LenMaxItem?: number;
  public Lock?: boolean = false;
  public SelectValue?: any;
}
