import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MimCategoriaDetalleConfiguracion } from '../mim-categoria-detalle/mim-categoria-detalle.component';

@Component({
  selector: 'app-mim-categoria',
  templateUrl: './mim-categoria.component.html',
})
export class MimCategoriaComponent implements OnInit {
  @Input()
  configuracion: MimCategoriaConfiguracion;

  @Output()
  selectAllEmitter = new EventEmitter();

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  /**
   * @description Controla vento al checkear el componente.
   *
   * @param categoria Categoria
   */
  _onSelectAll(categoria: any) {
    this.selectAllEmitter.emit(categoria);
  }
}

export class MimCategoriaConfiguracion {
  codigoCategoria: number;
  /**
   * @description Titulo de la categoria.
   */
  titulo?: string;

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description se le puede agregar un css al Badge
   */
  cssBgBadge = '';

  /**
   * Activa el compotamiento checkeado del componente.
   */
  seleccionado?: boolean;
  /**
   * @description Almacena el estado checkeado del componente.
   */
  _seleccionado?: boolean;

  /**
   * @description Detalles de categoria.
   */
  detalles: MimCategoriaDetalleConfiguracion[];
}
