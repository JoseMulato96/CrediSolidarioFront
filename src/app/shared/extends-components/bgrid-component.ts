import { EventEmitter, Output } from "@angular/core";
import { BaseComponent, BaseModel } from "./base-component";

export class BGridComponent extends BaseComponent {
  constructor() {
    super();

    let configPages: PageModel = this.Skeleton.PageConfig || new PageModel();
    this._ListPageSize = [];
    configPages.ListStepRow = configPages.ListStepRow || [10, 15, 20];
    for (const index of configPages.ListStepRow) {
      this._ListPageSize.push(index);
    }
  }

  _ListPageSize: number[] = [];
  _PosSums: number = 0;

  @Output("SelectPageSize")
  EvtSelectPageSize: EventEmitter<any> = new EventEmitter<any>();

  _OnSelectPageSize(value) {
    this.EvtSelectPageSize.emit(value);
  }

  /**
   * 
   * @description Actualizando el esqueleto de los parametros que resiven
   */
  Skeleton: GridModel = new GridModel();

  /**
   * 
   * @description Evento cuando hace click en el momento del boton del cell
   */
  @Output("btnaction")
  EvtClickBtnCell: EventEmitter<any> = new EventEmitter<any>();

  /**
   * r
   * @description carga los items en la configuracion Skeleton
   * @param items elementos
   */
  LoadItems(items: any[]): any {
    this.Skeleton.Data = items;
  }


   /**
   * @author Jose Wilson Mulato
   * @description carga los items en la configuracion Skeleton
   * @param items elementos
   */
  PushItems(items: any[]): any {
    this.Skeleton.Data.push(items);
  }

  /**
   * 
   * @description retorna el valor sea formateado
   * @param value valor de la posicion
   * @param column la columna que le corresponde
   * @param index la posición
   */
  _FormatterValue(value: any, column: ColumnsGridModel, index: number): string {
    let text = value[column.Key];

    if (column.ApplyFormatFunc) {
      text = column.ApplyFormatFunc(text, value, column, index);
    }
    return text;
  }

  /**
   * 
   * @description ejecuta el evento que aplico en la celda
   * */
  _OnClickBtnColumn(value, column, btn, position) {
    this.EvtClickBtnCell.emit({
      value,
      column,
      btn,
      position
    });
  }

  /**
   * 
   * @description El sistema evalua si hay que aplicar alguna funcionalidad de sumatoria
   * */
  _IsApplicationFunction(column: ColumnsGridModel, posicion: number) {
    let data: string = "";
    if (column.IsSum) {
      let sum: number = 0;
      this.Skeleton.Data.forEach((value, index) => {
        sum += value[column.Key] || 0;
      });
      this._PosSums = sum;
      data += sum;
    } else {
      return "";
    }
    return data;
  }

  /**
   * r
   * @description permite agregar un elemento
   * @param data item
   */
  AddItem(data: any) {
    this.Skeleton.Data.push(data);
  }

  /**
   * r
   * @description remueve el elemento
   * @param position
   */
  RemoveAt(position: number) {
    this.Skeleton.Data.splice(position, 1);
  }

  /**
   * r
   * @description el sistema valida valor antes de que precione el botones  opciones
   * @param value
   * @param btn
   */
  _CheckValid(value, btn) {
    if (btn.BeferoValid) {
      return !btn.BeferoValid(value, btn);
    }
    return false;
  }

  /**
   * r
   * @description cambia el numero de pagina que debe colocar
   * @param numb número de pagina
   */
  SetNumberPages(numb: number) {
    this._ItemsPages = [];
    for (let index = 0; index < numb; index++) {
      this._ItemsPages.push("#");
    }
  }

  /**
   * r
   * @description Cambio en la configuración
   * @param data PageModel
   */
  SetPageConfig(data: PageModel) {
    this.Skeleton.PageConfig.IsPages =
      data.IsPages || this.Skeleton.PageConfig.IsPages;
    this.Skeleton.PageConfig.ListStepRow =
      data.ListStepRow || this.Skeleton.PageConfig.ListStepRow;
    this.Skeleton.PageConfig.PageCurrent =
      data.PageCurrent || this.Skeleton.PageConfig.PageCurrent;
    this.Skeleton.PageConfig.PageSize =
      data.PageSize || this.Skeleton.PageConfig.PageSize;
  }

  _ItemsPages: string[] = [];
}

export class GridModel extends BaseModel {
  Columns: ColumnsGridModel[];
  Data: any[] = [];
  IsSearch?: boolean = false;
  PageConfig?: PageModel;
  IsExportExcel: boolean = false;
  FunctionExportExcel?: Function;
}

export class ColumnsGridModel {
  Label: string = "";
  Key: string = "";
  ItemsByStore?: string;
  FunctionStore?: string;
  IsSum?: boolean;
  TypeValue?: string;
  Buttons?: ButtonGridModel[];
  ApplyFormat?: string = "";
  ApplyFormatFunc?: Function = undefined;
  AlignText?: string = undefined;
  IsCheckboxs?: boolean = false;
  NotExportExcel?: boolean = false;
}

export class ButtonGridModel {
  IconCss?: string = "";
  Action: string = "";
  BeferoValid?: Function;
  Title?: string = "";
}

export class PageModel {
  PageSize?: number = 10;
  ListStepRow?: number[] = [10, 15, 20];
  PageCurrent?: number = 1;
  IsPages?: boolean = false;
}
