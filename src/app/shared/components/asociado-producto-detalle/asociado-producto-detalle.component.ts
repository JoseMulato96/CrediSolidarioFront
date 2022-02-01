import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APP_PARAMETROS } from '@shared/static/constantes/app-parametros';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asociado-producto-detalle',
  templateUrl: './asociado-producto-detalle.component.html',
  styleUrls: ['./asociado-producto-detalle.component.css']
})
export class AsociadoProductoDetalleComponent implements OnInit {
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: AsociadoProductoDetalleConfiguracion = new AsociadoProductoDetalleConfiguracion();

  // tslint:disable-next-line:no-output-rename
  @Output('click-item') clickItem: EventEmitter<any> = new EventEmitter<any>();
  auxilioFunerario: number =
    APP_PARAMETROS.PROTECCIONES.CATEGORIA_PROTECCION.AUXILIO_FUNERARIO;

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.refrescar();
  }

  refrescar() {
    (this.configuracion.items || []).forEach(item => {
      this.validaActivo(item);
    });
  }

  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description escucha click de los items
   */
  OnClickItem(item: ItemProductoDetalleConfiguracion) {
    const url = this.router.url;
    const tab = url.split('/').slice(-1)[0];

    this.clickItem.emit({ detalle: item, plan: this.configuracion.plan, tab: tab });
    this.configuracion.seleccion = item;
    this.refrescar();
  }
  /**
   * @author Jorge Luis Caviedes Alvarado
   * @description  valida si debe estar activo
   */
  validaActivo(item: ItemProductoDetalleConfiguracion) {
    if (
      this.configuracion.seleccion &&
      this.configuracion.seleccion.consecutivo === item.consecutivo
    ) {
      return (item.selecion = true);
    }

    item.selecion = false;
  }
}

export class AsociadoProductoDetalleConfiguracion {
  items?: ItemProductoDetalleConfiguracion[] = [];
  seleccion: ItemProductoDetalleConfiguracion;
  plan: any;
}

export class ItemProductoDetalleConfiguracion {
  proteccion = 0;
  cuotaAcumulada = 0;
  cuota = 0;
  proCod = 0;
  selecion = false;
  consecutivo = 0;
}
