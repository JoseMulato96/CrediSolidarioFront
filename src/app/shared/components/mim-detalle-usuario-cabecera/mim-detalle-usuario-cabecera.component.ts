import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-mim-detalle-usuario-cabecera',
  templateUrl: './mim-detalle-usuario-cabecera.component.html',
  styleUrls: ['./mim-detalle-usuario-cabecera.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MimDetalleUsuarioCabeceraComponent),
      multi: true
    }
  ]
})
export class MimDetalleUsuarioCabeceraComponent implements OnInit {

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimDetalleUsuarioCabeceraConfig = new MimDetalleUsuarioCabeceraConfig();

  constructor() {
    // do nothing
  }

  ngOnInit() {
    this._actualizar();
  }

  _actualizar() {
    this.configuracion.datos = this.configuracion.datos || {};
    this.configuracion.keyNombre = this.configuracion.keyNombre || '';

    this.configuracion.atributos = this.configuracion.atributos || [];
  }

}

export class MimDetalleUsuarioCabeceraConfig {
  public component?: MimDetalleUsuarioCabeceraComponent;
  public keyNombre = '';
  public keyApellido1 = '';
  public keyApellido2 = '';
  public datos?: any = {};
  public atributos?: MimDetalleUsuarioAtriutosConfig[] = [];
}

export class MimDetalleUsuarioAtriutosConfig {
  titulo = '';
  key = '';
}
