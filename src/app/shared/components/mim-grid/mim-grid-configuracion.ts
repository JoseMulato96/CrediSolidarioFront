import { MimGridComponent } from './mim-grid.component';

export class MimConfigRow {
  funDisable?: Function = null;
}

/**
 * @ GridConfiguracion
 * @ 25/04/2019
 * Copyright: Informática & Tecnología Stefanini S.A. All rights reserved
 * @author Jorge Luis Caviedes Alvarado
 */
export class MimGridConfiguracion {
  /**

   * @description El componente como tal
   */
  component?: MimGridComponent;
  /**
   * @description Propiedad de configurar las columnas de las tablas
   */
  columnas: ColumnaConfiguracion[] = [];

  habilitarSeleccionColumnas = false;

  /**
   * @descripcion Columnas seleccionadas.
   */
  _columnasSeleccionadas: ColumnaConfiguracion[] = [];

  /**
   * @description Obtiene los datos
   */
  datos?: object[] = [];

  /**
   * @description Titulo de la grid
   */
  titulo = '';

  /**
   * @description Pagina los datos con la catidad de los elementos contenido dentro del grid
   */
  paginarDatos = false;

  /**
   * @description Muestra u oculta el paginador
   */
  mostrarPaginador = true;

  /**
   * @description La pagina actual
   * */
  pagina = 0;

  /**
   * @description El maximo de paginas
   */
  maxPaginas = 1;

  /**
   * @description El tamaño de registro por pagina
   */
  tamano = 10;

  /**
   * @description Almacena el estado actual de ordenamiento de la tabla. Ejemplo: fecModificacion,desc
   */
  sort: string;

  /**
   * @description Cantidad de registro que trae
   */
  cantidadRegistros = 0;

  /**
   * @description Habilita el modo de seleccion.
   */
  selectMode = false;
  selectModeDisable = false;

  /**
   * @description El key que se va seleccionar para ckequear cuando se le envie los elementos checkeados
   */
  seleccionarByKey = '';

  /**
   * @description Indica si todas las filas estan seleccionadas.
   */
  isAllSelected = false;

  /**
   * @description Elementos que deberia estar selecionado
   */
  itemsSeleccionados: string[];

  /**
   * @description Indica el scroll para la tabla horizontal, por default no tiene scroll
   */
  scrollHorizontal = false;

  /**
   * @description Configuracion de la fila
   */
  configFila?: MimConfigRow = new MimConfigRow();

  /**
   * @description Se muestra en la cabecera otro filtro de mas
   */
  esFiltra = false;

  /**
   * @description Habilita el ordenamiento personalizado o server side de la tabla.
   */
  ordenamientoPersonalizado = false;

  /**
   * @description Obtiene los datos de los Dropdown
   */
  datosDropdown?: object[] = [];

  /**
   * @description Asignar valor por defetos de los Dropdown
   */
   selectedDefaultDropdown?: object[] = [];

  /**
   * @description Si habilitarSeleccionColumnas es true, por default se mostrarán 5 columnas
   */
  numeroColumnasDefault = 5;
}

/**
 * @ ColumnaConfiguracion
 * @ 25/04/2019
 * Copyright: Informática & Tecnología Stefanini S.A. All rights reserved
 * @author Jorge Luis Caviedes Alvarado
 */
export class ColumnaConfiguracion {
  /**
   * @description Llave de la columna
   */
  key?= '';
  /**
   * @description Titulo de la columna
   */
  titulo?= '';

  /**
   * @description Configuracion de la columna
   */
  configCelda?: ConfigCelda;

  /**
   * @description Para establecer un identificador
   */
  index?: number;

  /**
   * TODO(alobaton): Los siguientes campos se deberian migrar a configCelda para seguir el estandar.
   * NOTA** Para futuros campos se debe utilizar configCelda.
   */

  fun?: Function = null;

  typeFilter?= '';

  /**
   * @description Toma el dato string y le aplica trim
   */
  isTrim?= false;

  keyFiltro?= '';
}

/**
 * @ ConfigCelda
 * @ 25/04/2019
 * Copyright: Informática & Tecnología Stefanini S.A. All rights reserved
 * @author Jorge Luis Caviedes Alvarado
 */
export class ConfigCelda {
  /**
   * @description Tipo de dato de la columna
   */
  tipo?: string;

  /**
   * @description CSS de los datos de la columna
   */
  cssKey?= '';

  /**
 * @description Funcion para aplicar estilos CSS
 */
  funCss?: Function = null;

  /**
   * @description Estilos para icono.
   */
  cssIcon?= '';

  /**
   * @description Estilos para boton.
   */
  cssButton?= '';

  /**
   * @description Title para boton.
   */
  titleButton?= '';

  /**
   * @description Tooltip para boton
   */
  buttonTooltip?= '';

  /**
   * @description Ancho personalizado de la columna
   */
  width?: number | string;

  cssData?: string = '';

  /**
   * @description Funcion para habilitar o deshabilitar la columna
   */
  funDisabled?: Function = null;

  /**
   * @description Habilita el ordenamiento de una columna
   */
  habilitarOrdenamiento?= false;

  /**
   * @description Llave por la cual se va a realizar el ordenamiento. Si no viene indicada, se tomara la llave de la columna (key)
   */
  sortKey?: string;

  /**
   * @author Cesar Millan
   * @description Para combinar celdas
   */
  combinarCeldas?: ConfigCombinacion;

  /**
   * @description Codigo para identificar la lista desplegable
   */
  codeDropdown?= '';

  color?= '';

  /**
   * @description Indica si el titulo de la columna se rota
   */
  rotarCelda?= false;
}

/**
 * @ Row
 * @ 25/04/2019
 * Copyright: Informática & Tecnología Stefanini S.A. All rights reserved
 * @author Jorge Luis Caviedes Alvarado
 */
export class Row {
  /**
   * @description Indica si la fila esta seleccionada
   */
  selected = false;

  /**
   * @description Raw data de la fila. Datos originales.
   */
  _dato: any = {};

  desabilitar = false;

  constructor() {
    // do nothing
  }
}

/**
   * @author Cesar Millan
   * @description Para determinar el número de celdas a combinar
   * Nota: El ancho de la celda se multiplicara por el numero que se ingrese en el campo "numeroCombinar"
   */
export class ConfigCombinacion {
  omitir = false;
  numeroCombinar?: number;
}
