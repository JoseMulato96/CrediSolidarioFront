import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter
} from "@angular/core";
import {
  BinputComponent,
  InputModel
} from "../../extends-components/binput-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-combobox",
  templateUrl: "./s-combobox.component.html",
  styleUrls: ["./s-combobox.component.scss"]
})
export class SComboboxComponent extends BinputComponent implements OnInit {
  constructor(public http: HttpClient, public el: ElementRef) {
    super(http);
  }

  _Value: any = {};
  _Elements = [];
  _IsItemLoad: boolean = false;
  Skeleton: any = {};
  @Output("EvtSelectItem")
  EvtSelectItem: EventEmitter<any> = new EventEmitter<any>();

  Clear() {
    this.Skeleton.Data = undefined;
    this._Value = undefined;
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description configura y valida que la configuracion Skeleton se encuentre con los valores minimo y que las funciones de agregar por medio de servicio
   */
  ngOnInit() {
    this._Elements = this.Skeleton.Items || [];
    this.Skeleton.Placeholder = this.Skeleton.Placeholder || "Seleccionar";

    this._IsItemLoad = !!this.Skeleton.ItemsByStore;
    this.EvtLoadItemsByStore.subscribe(() => {
      this._IsItemLoad = false;
      this._Elements = this.Skeleton.Items || [];
      this._OrderByLabel();
    });
    this._OrderByLabel();

    let inputElements = this.el.nativeElement;
    let inputEl = inputElements.getElementsByTagName("select");
    inputEl[0].setAttribute("class", "s-combobox-select");
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

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Mostrar la lista de datos
   */
  OnClickIcon() {
    /**
     * Se obtiene el input y asignarle el focus para que despliegue la lista
     */
    let inputElements = this.el.nativeElement;
    let inputEl = inputElements.getElementsByTagName("select");
    inputEl[0].click();
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha el evento cuando seleciona un item
   * @param e
   */
  _OnChangeSelectItem(e) {
    if (e == -1) {
      let inputElements = this.el.nativeElement;
      let inputEl = inputElements.getElementsByTagName("select");
      inputEl[0].value = "";
      this.EvtSelectItem.emit(undefined);
      return (this.Skeleton.Data = undefined);
    }
    let element = this._Elements[e];
    this.Skeleton.Data = element;
    this.EvtSelectItem.emit(element);
  }
}
export class ComboboxModel extends InputModel {}
