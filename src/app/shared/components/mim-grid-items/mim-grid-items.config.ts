import { MimGridItemsComponent } from './mim-grid-items.component';

export class MimConfigRow {
    funDisable?: Function = null;
  }

export class MimGridItemsConfig {

    component?: MimGridItemsComponent;

    columnas: ColumnaConfiguracion[] = [];

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
   * @description Cantidad de registro que trae
   */
  cantidadRegistros = 0;

   /**
   * @description Configuracion de la fila
   */
  configFila?: MimConfigRow = new MimConfigRow();

  borderLeft = false;

}

export class ColumnaConfiguracion {
    /**
     * @description Llave de la columna
     */
    key ?= '';
    /**
     * @description Titulo de la columna
     */
    titulo ?= '';

    /**
     * @description Configuracion de la columna
     */
    configCelda?: ConfigCelda;

    /**
     * @description Para establecer un identificador
     */
    index?: number;

    fun?: Function = null;

}

export class ConfigCelda {
    /**
     * @description Tipo de dato de la columna
     */
    tipo?: string;

    /**
     * @description CSS de los datos de la columna
     */
    cssKey ?= '';

    /**
   * @description Funcion para aplicar estilos CSS
   */
    funCss?: Function = null;

    /**
     * @description Estilos para icono.
     */
    cssIcon ?= '';

    /**
     * @description Estilos para boton.
     */
    cssButton ?= '';

    /**
     * @description Title para boton.
     */
    titleButton ?= '';

    /**
     * @description Ancho personalizado de la columna
     */
    width?: number | string;

    /**
     * @description Funcion para habilitar o deshabilitar la columna
     */
    funDisabled?: Function = null;

    color ?= '';

    classCss ? = '';

}
