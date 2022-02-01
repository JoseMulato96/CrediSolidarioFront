import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ProductoDetalleService {
  constructor() {
    // do nothing
  }

  private readonly eventoDetalle = new BehaviorSubject<{
    detalleSeleccion: any;
    detalles: any[];
    plan: any;
  }>(undefined);

  public readonly store: Observable<any> = this.eventoDetalle.asObservable();

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha el dato enviado por setCambioDetalleProducto
   */
  getCambioDetalleProducto() {
    return this.eventoDetalle;
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description envia el detalle del produto a todos los subcriptores
   */
  setCambioDetalleProducto(detalleSeleccion, detalles, plan) {
    const store = { detalleSeleccion, detalles, plan };
    return this.eventoDetalle.next(store);
  }

  cleanStore() {
    return this.eventoDetalle.next(undefined);
  }
}
