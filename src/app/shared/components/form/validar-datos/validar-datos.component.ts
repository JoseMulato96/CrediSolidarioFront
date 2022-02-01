import { Component, Input } from '@angular/core';
import {
  ControlContainer
} from '@angular/forms';

@Component({
  selector: 'app-validar-datos',
  templateUrl: './validar-datos.component.html',
})
export class ValidarDatosComponent {
  today: Date;
  canalVentas: any;
  promotoresComerciales: any;
  tipoCotizaciones: any;
  fechaNacimient: string;
  bloquearFechaSolicitud: boolean;
  esVenta: boolean;
  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
      this.canalVentas = value.canalVentas;
      this.promotoresComerciales = value.promotoresComerciales;
      this.tipoCotizaciones = value.tipoCotizaciones;
      this.bloquearFechaSolicitud = value.bloquearFechaSolicitud;
      this.esVenta = value.esVenta || false;
    }
  }

  constructor(public controlContainer: ControlContainer) {
    this.today = new Date();
    this.canalVentas = [];
    this.promotoresComerciales = [];
    this.tipoCotizaciones = [];
    this.esVenta = false;
  }

}
