import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mim-deducciones-card',
  templateUrl: './mim-deducciones-card.component.html',
})
export class MimDeduccionesCardComponent implements OnInit {
  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimDeduccionesCardConfig = new MimDeduccionesCardConfig();

  _leftItems: MimDeduccionesCardItemConfigInterface[] = [];
  _rightItems: MimDeduccionesCardItemConfigInterface[] = [];

  constructor() {
    // do nothing
  }

  ngOnInit() {
    if (this.configuracion) {
      this.configuracion.component = this;
    }

    this._actualirzarDatos();
  }

  cargarDatos(valores: any) {
    this._actualirzarDatos(valores);
  }

  _actualirzarDatos(valores: any = {}) {
    this.configuracion.leftItems = this.configuracion.leftItems || [];
    this._leftItems = [];
    this.configuracion.leftItems.forEach(leftItem => {
      this._leftItems.push({
        label: leftItem.label,
        labelParams: leftItem.labelParams,
        key: leftItem.key,
        value: valores[leftItem.key] || '',
        tipo: leftItem.tipo
      });
    });

    this.configuracion.rightItems = this.configuracion.rightItems || [];
    this._rightItems = [];
    this.configuracion.rightItems.forEach(rightItem => {
      this._rightItems.push({
        label: rightItem.label,
        labelParams: rightItem.labelParams,
        key: rightItem.key,
        value: valores[rightItem.key] || '',
        tipo: rightItem.tipo
      });
    });
  }
}

export class MimDeduccionesCardConfig {
  leftItems?: MimDeduccionesCardItemConfig[] = [];
  rightItems?: MimDeduccionesCardItemConfig[] = [];
  labelTotal: string;
  labelSubtotal: string;
  total: number;
  subtotal: number;
  component?: MimDeduccionesCardComponent;
}

export class MimDeduccionesCardItemConfig {
  label = '';
  labelParams?: any = {};
  key = '';
  tipo = 'normal';
  value?: string;
}

interface MimDeduccionesCardItemConfigInterface {
  label: string;
  labelParams?: any;
  value: string;
  key: string;
  tipo?: string;
}

