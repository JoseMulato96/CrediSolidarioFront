import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation
} from "@angular/core";
import * as XLSX from "xlsx";
import {
  BGridComponent,
  ColumnsGridModel
} from "../../extends-components/bgrid-component";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "s-grid",
  templateUrl: "./s-grid.component.html",
  styleUrls: ["./s-grid.component.scss"]
})
export class SGridComponent extends BGridComponent implements OnInit {
  constructor(public el: ElementRef) {
    super();
  }

  @Output()
  EvtSelectPage: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  EvtSelectRow: EventEmitter<any> = new EventEmitter<any>();

  _RowSelects: any[] = [];
  /// uso para html
  p: any;

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha cuando seleciona la pagina
   * @param page
   */
  _OnSelectPage(page) {
    this.EvtSelectPage.emit(page);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description escucha cuando seleciona fila del grid
   * @param isSelect
   * @param value
   * @param position
   */
  _OnSelectRow(isSelect, value, position) {
    value._Select = !value._Select;
    this.EvtSelectRow.emit(this.Skeleton.Data.find(x => x._Select));
  }

  ngOnInit() {}

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description El sistema toma los datos actuales para exportar en un excel.
   */
  ExportFileExcel() {
    if (this.Skeleton.FunctionExportExcel) {
      return this.Skeleton.FunctionExportExcel(this);
    }
    /**
     * se construye la lista de datos
     */
    let columns = this.Skeleton.Columns;
    let data = this.Skeleton.Data;

    let dataexport: Array<Array<string>> = [];
    let rowCol: string[] = [];
    for (let index = 0; index < columns.length; index++) {
      if (columns[index].NotExportExcel) {
        continue;
      }
      rowCol.push(columns[index].Label);
    }
    dataexport.push(rowCol);

    let row: string[] = [];
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      let value = data[rowIndex];
      row = [];
      for (let index = 0; index < columns.length; index++) {
        let col: ColumnsGridModel = columns[index];
        if (col.NotExportExcel) {
          continue;
        }
        row.push(this._FormatterValue(value, col, rowIndex));
      }
      dataexport.push(row);
    }

    this.ExportFileExcelData(dataexport);
  }

  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description Obtiene un archivo en excel con base a los datos enviados
   * @param dataexport
   */
  ExportFileExcelData(dataexport: Array<Array<string>>) {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dataexport);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");

    /* save to file */
    XLSX.writeFile(wb, "informacion.xlsx");
  }
}
