import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mim-categoria-detalle',
  templateUrl: './mim-categoria-detalle.component.html',
})
export class MimCategoriaDetalleComponent implements OnInit {
  @Input()
  configuracion: MimCategoriaDetalleConfiguracion;

  @Output()
  selectEmitter = new EventEmitter();

  @Output()
  dropdownEmitter = new EventEmitter();

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  /**
   *
   * @description Captura evento al seleccionar una fila
   * @param row Fila seleccionada
   */
  _onSelectRow(row: any) {
    this.selectEmitter.emit(row);
  }

  /**
   *
   * @description Ejecuta la funcion css de estados.
   */
  executeCssFun() {
    return this.configuracion.estadoConf.cssFun(this.configuracion.estadoConf.param);
  }

  /**
   * .
   * @description Toggle dropdown.
   */
  _toggle() {
    this.configuracion._dropdown = !this.configuracion._dropdown;

    this.dropdownEmitter.emit(this.configuracion);
  }
}

/**
 * @description Configuracion de detalles de categoria.
 *
 */
export class MimCategoriaDetalleConfiguracion {
  /**
   * @description Llavel del detalle de categoria.
   */
  key?: any;
  /**
   * @description Titulo del detalle de categoria
   */
  titulo?: string;
  /**
   * Activa el compotamiento checkeado del componente.
   */
  seleccionado?: boolean;
  /**
   * @description Almacena el estado checkeado del componente.
   */
  _seleccionado?: boolean;
  /**
   * @description Atributos del detalle.
   */
  atributos?: MimCategoriaAttributesConfiguracion[];

  /**
   * @description Activa la opcion de aplicar dropdown al componente.
   */
  dropdown = false;

  /**
   * @description Controla el dropdown del componente.
   */
  _dropdown = false;

  /**
   * @description Estado del detalle.
   */
  estadoConf?: MimEstadoConfiguracion;

  subTitleDetail?: MimCategoriaAttributesConfiguracion[];
}

/**
 * @description Configuracion de atributos de categorias
 *
 */
export class MimCategoriaAttributesConfiguracion {
  /**
   * @description Llavel de atributo. Corresponde al key del JSON.
   */
  key?: string;
  /**
   * @description Titulo del atributo.
   */
  titulo?: string;
  /**
   * @description: Valor del atributo.
   */
  valor?: any;
  /**
   * @description Tipo del atributo.
   */
  tipo?: string;

  icono?: string;

  boton?: string;

  tooltip?: string;
}

/**
 * @description Configuracion de estado.
 *
 */
export class MimEstadoConfiguracion {
  titulo?: string;
  cssFun: Function;
  param?: any;
}
