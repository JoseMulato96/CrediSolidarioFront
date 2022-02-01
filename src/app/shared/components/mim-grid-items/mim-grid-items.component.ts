import { Component, OnInit, Input } from '@angular/core';
import { MimGridItemsConfig, ColumnaConfiguracion } from './mim-grid-items.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mim-grid-items',
  templateUrl: './mim-grid-items.component.html',
  styleUrls: ['./mim-grid-items.component.css']
})
export class MimGridItemsComponent implements OnInit {

  /**
   * @description Datos
   */
  datos: any[] = [];

  columnTh: any;

  /**
   * @description Variable para almacenar el listado de las columnas
   */
  listaNombreColumnnas: any[];

  @Input()
  configuracion: MimGridItemsConfig = new MimGridItemsConfig();

  constructor(private readonly translate: TranslateService) { }

  ngOnInit(): void {
    if (this.configuracion) {
      this.configuracion.component = this;
    }

    this.updateData();
    this.columnTh = this.configuracion.columnas.filter((col: any) => !col.configCelda);
  }

  private updateData() {
    this.configuracion.datos = this.configuracion.datos || [];
    this.datos = this.configuracion.datos;
    this.configuracion.columnas.forEach(col => this.widthColumn(col));

    this.configuracion.datos.forEach((dato: any) => {
      this.configuracion.columnas.forEach(col => {
        this.getValue(dato, col);
      });
    });
  }

  private widthColumn(columna: ColumnaConfiguracion) {
    if (columna.configCelda && columna.configCelda.width) {
      if (typeof columna.configCelda.width === 'number') {
        columna.configCelda.width = `${String(columna.configCelda.width)}`;
      }
    }
  }

  /**
   * @description Examina del dato el valor que debe sacar con respecto a la columna.
   */
  private getValue(dato: object, columna: ColumnaConfiguracion) {
    let value = this.obtenerValorRow(columna.key, dato);

    // Si se especifico una funcion de transformacion, la aplicamos.
    if (columna.fun && value) {
      value = columna.fun(value.toString());
    }

    // Reasignamos el valor a la estructura. (alobaton): Esto no se deberia hacer, la idea es mantener la estructura intacta.
    dato[columna.key] = value;

    // Retornamos el valor.
    return value;
  }

  obtenerValorRow(columnaKey: string, rowData: any) {
    let obj: object;
    if (columnaKey && columnaKey.includes('.')) {
      for (const _columnaKey of columnaKey.split('.')) {
        obj = obj === undefined || obj === null ? rowData[_columnaKey] : obj[_columnaKey];
        if ((obj === undefined || obj === null) && !rowData[_columnaKey]) { break; }
      }
    } else {
      obj = columnaKey ? rowData[columnaKey] : null;
    }
    if (obj === undefined || obj === null) {
      return '';
    }
    if (typeof (obj) === 'string') {
      return String(obj);
    } else if (typeof (obj) === 'number') {
      return String(obj);
    } else if (typeof (obj) === 'boolean') {
      return String(obj);
    } else {
      return obj;
    }
  }

  /**
   * @description Carga los datos de la grtilla.
   */
  public cargarDatos(datos: object[], options?: any) {
    this.datos = [];
    this.configuracion.datos = datos;

    // Actualizamos los datos de la grilla.
    this.updateData();
  }

  /**
   * @description Limpia datos de la grilla.
   */
  public limpiar() {
    this.cargarDatos([]);
    this.configuracion.maxPaginas = 0;
    this.configuracion.pagina = 0;
    this.configuracion.cantidadRegistros = 0;
    this.updateData();
  }

  public getCssValue(rowData, columna: ColumnaConfiguracion) {
    const value: string = rowData[columna.configCelda.cssKey] || '';

    if (columna.configCelda.funCss !== null && columna.configCelda.funCss !== undefined
      && value !== undefined && value !== null) {
      return columna.configCelda.funCss(value.toString());
    }
  }

}
