import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { ObjectUtil } from '@shared/util/object.util';
import { SelectItem } from 'primeng/api/selectitem';
import { Table } from 'primeng/table';
import { fromEvent } from 'rxjs';
import { from } from 'rxjs/internal/observable/from';
import { auditTime, map, share } from 'rxjs/operators';
import { ES } from '../mim-date-picker/mim-date-picker.component';
import { ColumnaConfiguracion, MimConfigRow, MimGridConfiguracion, Row } from './mim-grid-configuracion';

@Component({
  selector: 'app-mim-grid',
  templateUrl: './mim-grid.component.html',
  styleUrls: ['./mim-grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MimGridComponent implements OnInit {
  _isColumnas: Promise<any>;
  /**
   * @description La cantidad de registro visitados
   */
  _regVisto: number;
  /**
   * @description Cantidad de registro filtrados.
   */
  _cantidadRegistrosFiltrados = 0;
  /**
   * @description Si fue filtrado.
   */
  _esFiltrado = false;

  /**
   * @description Catidad registro contenidos
   */
  _totalRegistros = 0;

  /**
   * @description Cantidad de registros a mostrar
   */
  _cant = 0;
  /**
   * @description Contiene los elementos seleccionados en memoria.
   */
  _memoriaSelecionRegistro: Row[] = [];
  /**
   * @description Seleciona o deseleciona todos los elementos
   */
  _seleccionarTodos = false;

  /**
   * @description para sacar los filtros.
   */
  _listFiltros: any = {};

  itemsSeleccionados: string | number | any[] = [];
  /**
   * @description Espejo de datos pero con la configuracion.
   */
  _rows: Row[] = [];
  /**
   * @description Datos
   */
  _datos: any[] = [];

  _itemsSelected: any[] = [];

  columnTh: any;

  /**
   * @description Variable para almacenar el listado de las columnas
   */
  listaNombreColumnnas: SelectItem[];
  /**
   * @description Listado de columnas seleccionadas
   */
  columnasSeleccionadas: any;
  columnasAll: ColumnaConfiguracion[] = [];

  inputSearch = new FormControl('');
  fechaInicioFin = new FormControl(null);
  form: FormGroup;
  es = ES;

  dropdownSelectedDefault: any;

  /**
   * Entradas del componente
   */
  @Input()
  configuracion: MimGridConfiguracion = new MimGridConfiguracion();

  /**
   * Eventos de la grilla. NOTA: Los outpus no deben ser re nombrados.
   */
  @Output()
  filtroHeader: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  clickCelda: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  clickCeldaElement: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  siguiente: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  atras: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  seleccionar = new EventEmitter<any>();
  @Output()
  deseleccionar = new EventEmitter<any>();
  @Output()
  ordenar = new EventEmitter<any>();

  @Output()
  selectDropdown = new EventEmitter<any>();

  constructor(
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly formBuider: FormBuilder
  ) { }

  ngOnInit() {
    if (this.configuracion) {
      this.configuracion.component = this;
    }

    if (this.configuracion.habilitarSeleccionColumnas) {
      this.columnasAll = this.configuracion.columnas.map((item: ColumnaConfiguracion, index) => {
        return { ...item, index: index + 1 };
      });
      const listTitulos = this.columnasAll.map(item => ({ label: item.titulo })) as any;
      ObjectUtil.traducirObjeto(listTitulos, this.translate);
      this.listaNombreColumnnas = listTitulos.map((item, index) => ({ ...item, value: index + 1 }));
      this.configuracion.columnas = this.columnasAll.filter((item, index) => (index < this.configuracion.numeroColumnasDefault));
      this.columnasSeleccionadas = this.listaNombreColumnnas
        .filter((item: any) => (item.value <= this.configuracion.numeroColumnasDefault))
        .map(item => item.value);
    }

    this._updateData();
    this.columnTh = this.configuracion.columnas.filter((col: any) => {
      return (!col.configCelda || !col.configCelda.combinarCeldas || !col.configCelda.combinarCeldas.omitir);
    });

    if (this.configuracion.esFiltra) {
      this.initFormSearch();
    }
  }


  initFormSearch() {
    this.form = this.formBuider.group({
      fechaInicioFin: new FormControl(null)
    });
  }
  /**
   * Funcionalidades del la grid publicas
   */

  /**
   * @description Carga los datos de la grtilla.
   */
  public cargarDatos(datos: object[], options?: any) {
    this._datos = [];
    this._rows = [];
    this.configuracion.datos = datos;

    if (options) {
      this.configuracion.maxPaginas =
        options.maxPaginas || this.configuracion.maxPaginas;
      this.configuracion.pagina = parseInt(options.pagina || this.configuracion.pagina, 10);
      this.configuracion.cantidadRegistros =
        options.cantidadRegistros || this.configuracion.cantidadRegistros;
    }

    // Actualizamos los datos de la grilla.
    this._updateData();
  }

  public cargarDatosDropdown(datos: object[]) {
    this.configuracion.datosDropdown = datos;
  }

  public selecrtedDropdown(datos: object[]){
    this.configuracion.selectedDefaultDropdown = datos;
  }

  /**
   * @description Limpia datos de la grilla.
   */
  public limpiar() {
    this.cargarDatos([]);
    this.configuracion.maxPaginas = 0;
    this.configuracion.pagina = 0;
    this.configuracion.cantidadRegistros = 0;
    this._updateData();
  }

  /**
   * @description Obtiene todos los datos seleccionados.
   */
  public obtenerTodosSeleccionados() {
    return this._memoriaSelecionRegistro.map(x => {
      return x._dato;
    });
  }

  /**
   * @description Obtiene los seleccionados por pagina.
   */
  public getSeleccionadoPagina() {
    return this._getSelected();
  }

  /**
   * @description Obtiene un valor por llave.
   * @param row Row
   * @param columna Configuracion de la columna
   */
  public getCssValue(rowData, columna: ColumnaConfiguracion) {
    const value: string = rowData[columna.configCelda.cssKey] || '';

    if (columna.configCelda.funCss !== null && columna.configCelda.funCss !== undefined
      && value !== undefined && value !== null) {
      return columna.configCelda.funCss(value.toString());
    }

    return '';
  }

  private _widthColumn(columna: ColumnaConfiguracion) {
    if (columna.configCelda && columna.configCelda.width) {
      if (typeof columna.configCelda.width === 'number') {
        columna.configCelda.width = `${String(columna.configCelda.width)}`;
      }
    }
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description Valida si hay datos en la grilla.
   */
  public hayDatos() {
    return !!(this.configuracion.datos || []).length;
  }

  /**
   * Funciones privadas conmunicando con el HTML.
   */

  /**
   * @author: Jorge Luis Caviedes Alvarado
   * @description: escucha el evento cuando hace click a la celda y dispara un evento que celda fue selecionada y datos
   */
  _onClickCelda(row: Row, col, e) {
    this.clickCelda.emit(row._dato);
    this.clickCeldaElement.emit({
      config: row,
      dato: row._dato,
      col,
      e
    });
  }

  /**
     * @author: Edwar Ferney Murillo Arboleda
     * @description: Verifica si se debe habilitar o deshabilitar el boton basado en una logica
     */
  funDisabled(col: any, row: Row) {
    if (col.configCelda.funDisabled) {
      return col.configCelda.funDisabled(row);
    }
    return false;
  }

  /**
   * @description Copia al portapapeles
   */
  _onClickCopiar(text: string) {
    ObjectUtil.copiarAlClipboard(text);
  }

  /**
   * @description Examina del dato el valor que debe sacar con respecto a la columna.
   */
  private _getValue(dato: object, columna: ColumnaConfiguracion) {
    let value = this._obtenerValorRow(columna.key, dato);

    // Si se especifico una funcion de transformacion, la aplicamos.
    if (columna.fun && value) {
      value = columna.fun(value.toString());
    }

    // Si debemos aplicar trim al valor, lo realizamos.
    if (columna.isTrim) {
      if (value instanceof String) {
        value = value.trim();
      }
    }

    // Reasignamos el valor a la estructura. (alobaton): Esto no se deberia hacer, la idea es mantener la estructura intacta.
    dato[columna.key] = value;

    // Retornamos el valor.
    return value;
  }

  private _cantidadRegistros() {
    // Si hay cantidad de filtrados se toma el valor.
    this._totalRegistros = this.configuracion.cantidadRegistros;
    if (this._esFiltrado) {
      this._totalRegistros = this._cantidadRegistrosFiltrados;
    }
  }

  /**
   * @description calcula la cantidad de registro
   */
  private _calcularCantidad() {
    this._cantidadRegistros();

    this._regVisto = Math.min(
      (this.configuracion.pagina + 1) * this.configuracion.tamano,
      this._totalRegistros
    );
    if (this.configuracion.paginarDatos) {
      this._cant = Math.min(
        this.configuracion.pagina * this.configuracion.tamano,
        this._totalRegistros
      );
    }
  }

  /**
   * @description Redirige a la siguiente pagina
   */
  _onClickSiguiente() {
    if (
      (this.configuracion.pagina + 1) * this.configuracion.tamano <
      this._totalRegistros
    ) {
      this.configuracion.pagina++;
      this._calcularCantidad();
      this.siguiente.emit({
        pagina: this.configuracion.pagina,
        tamano: this.configuracion.tamano,
        sort: this.configuracion.sort
      });
    }
  }

  /**
  * @description Redirige a la pagina anterior
  */
  _onClickAtras() {
    if (this.configuracion.pagina) {
      this.configuracion.pagina--;
      this._calcularCantidad();
      this.atras.emit({
        pagina: this.configuracion.pagina,
        tamano: this.configuracion.tamano,
        sort: this.configuracion.sort
      });
    }
  }

  /**
   * @description Redirige a la pagina inicial de la tabla
   */
  _onClickInicio() {
    if (this.configuracion.pagina) {
      this.configuracion.pagina = 0;
      this._calcularCantidad();
      this.atras.emit({
        pagina: 0,
        tamano: this.configuracion.tamano,
        sort: this.configuracion.sort
      });
    }
  }

  /**
   * @description Redirige a la ultima pagina de la tabla.
   */
  _onClickFin() {
    if (
      (this.configuracion.pagina + 1) * this.configuracion.tamano <
      this._totalRegistros
    ) {
      const div: number = this._totalRegistros / this.configuracion.tamano;

      this.configuracion.pagina = Math.floor(div);

      const mod: number =
        this.configuracion.cantidadRegistros % this.configuracion.tamano;
      this.configuracion.pagina += mod === 0 ? -1 : 0;

      this._calcularCantidad();
      this.siguiente.emit({
        pagina: this.configuracion.pagina,
        tamano: this.configuracion.tamano,
        sort: this.configuracion.sort
      });
    }
  }

  /**
   * @description extrae los valores sin repetirlos
   */
  _filterMuliSelect(col) {
    this._dropdownSelectedDefault(col);
    if (col.configCelda.codeDropdown !== undefined && this.configuracion.datosDropdown.length > 0) {
      return this.configuracion.datosDropdown.filter((x: any) => x.code === col.configCelda.codeDropdown).map((x: any) => x.datos)[0];
    }

    return this._listFiltros[col.key] || [];
  }

  _dropdownSelectedDefault(col){
    if (!this.dropdownSelectedDefault && this.configuracion.selectedDefaultDropdown !== undefined
      && col.configCelda.codeDropdown !== undefined && this.configuracion.datosDropdown.length > 0) {
      const listOptions = this.configuracion.datosDropdown.filter((x: any) => x.code === col.configCelda.codeDropdown).map((x: any) => x.datos)[0];
      const codeDefault: any = this.configuracion.selectedDefaultDropdown.find((x: any) => x.code === col.configCelda.codeDropdown);
      if(codeDefault){
        this.dropdownSelectedDefault = listOptions.find(x => x.value === codeDefault.dato);
      }
    }

  }

  /**
   * @description Actualiza los datos de la lista
   */
  private _updateData() {
    this._rows = [];

    this.configuracion.datos = this.configuracion.datos || [];
    this.configuracion.mostrarPaginador =
      this.configuracion.mostrarPaginador === undefined
        ? true
        : this.configuracion.mostrarPaginador;
    this._calcularCantidad();

    this.configuracion.columnas.forEach(col => this._widthColumn(col));

    this.configuracion.datos.forEach((dato: any) => {
      this.configuracion.columnas.forEach(col => {
        this._getValue(dato, col);
        this._sacarListaFiltros(dato, col);
      });
      const row = {
        _dato: dato
      } as Row;
      const configFila: MimConfigRow = this.configuracion.configFila;
      if (configFila && configFila.funDisable) {
        row.desabilitar = configFila.funDisable(dato);
      }

      if (this._memoriaSelecionRegistro.length) {
        const position = this._buscarMemoriaIndex(row);
        if (position !== -1) {
          row.selected = true;
        }
      }

      this._rows.push(row);

      if (this._datos.indexOf(dato) === -1) {
        this._datos.push(dato);
      }

    });

    this._validaCheckSeleccionarTodos();
    this._scrollTop();

  }

  private _sacarListaFiltros(dato: any, col: ColumnaConfiguracion) {
    if (col.typeFilter !== 'multiselect') {
      return;
    }

    this._listFiltros[col.key] = this._listFiltros[col.key] || [];
    const option = { label: dato[col.key], value: dato[col.key] };
    if (!this._containsOption(this._listFiltros[col.key], option)) {
      this._listFiltros[col.key].push(option);
    }

    this._listFiltros[col.key] = this._listFiltros[col.key].sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0);
  }

  private _containsOption(filter: any, option: any) {
    for (let i = 0; i < filter.length; i++) {
      if (filter[i].label === option.label) {
        return true;
      }
    }

    return false;
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description valida si todos los elementos esta seleccionado
   */
  private _validaCheckSeleccionarTodos() {
    let esSeleccionadoTodos = true;
    this._rows.forEach(x => {
      esSeleccionadoTodos = esSeleccionadoTodos && x.selected;
      if (esSeleccionadoTodos) {
        return;
      }
    });
    this.configuracion.isAllSelected = esSeleccionadoTodos;
    this._seleccionarTodos = esSeleccionadoTodos;
  }

  deselectAllRows() {
    this._rows.forEach(x => {
      x._dato.estadoRow = false;
    });

    this._memoriaSelecionRegistro = [];
  }

  selectAllRows() {
    this._seleccionarTodos = !this._seleccionarTodos;
    this.configuracion.isAllSelected = !this.configuracion.isAllSelected;
    this._rows.forEach(x => {
      x.selected = this.configuracion.isAllSelected;
      x._dato.estadoRow = this.configuracion.isAllSelected;
    });

    this.configuracion.datos.forEach((x: any) => {
      x.estadoRow = this.configuracion.isAllSelected;
    });
    this._memoriaSelecionRegistro = this._getSelected();

    this.seleccionar.emit(this._memoriaSelecionRegistro);
  }

  /**
   *
   * @description escucha eventos al seleccionar una fila.
   */
  selectRow(row: any) {
    const idKey = this.configuracion.seleccionarByKey;
    this._rows.forEach(x => {
      if (x._dato[idKey] === row[idKey]) {
        x._dato.estadoRow = x._dato.estadoRow ? !x._dato.estadoRow : true;
      }
    });

    this.configuracion.datos.forEach((x: any) => {
      if (x[idKey] === row[idKey]) {
        x.estadoRow = x.estadoRow ? !x.estadoRow : true;
      }
    });
    this._memoriaSelecionRegistro = this._getSelected();
    if (row && row.estadoRow) {
      this.seleccionar.emit(this._memoriaSelecionRegistro);
    } else {
      this.deseleccionar.emit(row);
    }

    this._validaCheckSeleccionarTodos();
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description busca en memoria la posicion del registro
   */
  private _buscarMemoriaIndex(row: Row) {
    const position = this._memoriaSelecionRegistro.findIndex(x => {
      return String(
        x._dato[this.configuracion.seleccionarByKey] || ''
      ).includes(row._dato[this.configuracion.seleccionarByKey]);
    });

    return position;
  }

  private _getSelected() {
    return this._rows.filter(x => x._dato.estadoRow);
  }

  _filterTable(
    dt: Table,
    value: string,
    col: ColumnaConfiguracion,
    matchMode = 'contains'
  ) {
    const codigoControl = col.configCelda && col.configCelda.codeDropdown ? col.configCelda.codeDropdown : undefined;
    if (codigoControl && this.configuracion.datosDropdown.length > 0) {
      const item = this._itemsSelected.find(x => x.codeControl === codigoControl);
      if (item) {
        const index = this._itemsSelected.indexOf(item);
        this._itemsSelected[index] = { codigoDropdown: value, codeControl: codigoControl };
      } else {
        this._itemsSelected.push({ codigoDropdown: value, codeControl: codigoControl });
      }
      this.selectDropdown.emit(this._itemsSelected);
    } else {
      dt.filter(value, col.key, matchMode);
    }
  }


  _filterWhithDropdown(event, col) {
    this.selectDropdown.emit({ codigoDropdown: event, codeControl: col.configCelda.codeDropdown });
  }

  _onFilterResultado(evt: any) {
    this._cantidadRegistrosFiltrados = (evt.filteredValue || []).length;
    this._esFiltrado = true;
    this.configuracion.pagina = 0;
    this.configuracion.datos = evt.filteredValue;
    // Actualizamos los datos de la grilla.
    this._updateData();
  }

  _sortFunction($event) {
    const orden = {
      pagina: this.configuracion.pagina,
      tamano: this.configuracion.tamano
    };
    if ($event.sortField && $event.sortOrder) {
      orden['sort'] = `${$event.sortField},${$event.sortOrder === 1 ? 'desc' : 'asc'}`;
      this.configuracion.sort = orden['sort'];
    }
    this.ordenar.emit(orden);
  }

  _obtenerValorRow(columnaKey: string, rowData: any) {
    let obj: object;
    for (const _columnaKey of columnaKey.split('.')) {
      obj = obj === undefined || obj === null ? rowData[_columnaKey] : obj[_columnaKey];
      if ((obj === undefined || obj === null) && !rowData[_columnaKey]) { break; }
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

  _scrollTop() {
    if (!!document.querySelector('.ui-table-wrapper table')) {
      const wit = document.querySelector('.ui-table-wrapper table').clientWidth;
      from(document.getElementsByClassName('scrollTopInterno')).subscribe(
        (x: any) => { x.style.width = wit + 'px'; }
      );
      if (document.querySelector('.scrollTop')) {
        fromEvent(document.querySelector('.scrollTop'), 'scroll').pipe(
          auditTime(200),
          map((event: any) => {
            return event.target.scrollLeft;
          }),
          share()
        ).subscribe(resp => {
          document.querySelector('.ui-table-wrapper').scrollLeft = resp;
        });
      }

      if (document.querySelector('.ui-table-wrapper')) {
        fromEvent(document.querySelector('.ui-table-wrapper'), 'scroll').pipe(
          auditTime(200),
          map((event: any) => {
            return event.target.scrollLeft;
          }),
          share()
        ).subscribe(resp => {
          document.querySelector('.scrollTop').scrollLeft = resp;
        });
      }

    }
  }

  selectColumnas(event) {
    this.configuracion.columnas = this.columnasAll.filter(item => event.value.find(x => x === item.index));
    this.columnTh = this.configuracion.columnas.filter((col: any) => {
      return (!col.configCelda || !col.configCelda.combinarCeldas || !col.configCelda.combinarCeldas.omitir);
    });
  }

  filterTableBack(value: any, col: ColumnaConfiguracion) {
    let _value = this.inputSearch.value;
    if (col.typeFilter === 'date') {
      if (this.fechaInicioFin.value === null) {
        _value = '';
      } else {
        if (this.fechaInicioFin.value[0] !== null && this.fechaInicioFin.value[1] === null) {
          this.translate.get('global.alertas.filtroRangoFecha').subscribe(mensaje => {
            this.alertService.info(mensaje);
          });
          return;
        }
        if (this.fechaInicioFin.value[0] !== null && this.fechaInicioFin.value[1] !== null) {
          _value = this.getFechaFitro(this.fechaInicioFin.value[0]) + ',' + this.getFechaFitro(this.fechaInicioFin.value[1]);
        }
      }
    }
    const event = { valor: _value, columna: col };
    this.filtroHeader.emit(event);
  }

  getFechaFitro(fecha: Date) {
    return DateUtil.dateToString(fecha);
  }
}
