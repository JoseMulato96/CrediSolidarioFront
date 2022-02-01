import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-configuracion-gestion-diaria',
  templateUrl: './gestion-diaria.component.html',
})
export class ConfiguracionGestionDiariaComponent implements OnInit {

  procesos: any[];
  tiposAsignaciones: any[];
  productos: any[];
  usuarios: any[];

  @Input('dataInit')
  set dataInit(value: any) {
    if (value) {
      this.procesos = value.procesos;
      this.tiposAsignaciones = value.tiposAsignaciones;
      this.productos = value.productos;
      this.usuarios = value.usuarios;
    }
  }

  constructor(public controlContainer: ControlContainer) {
    this.procesos = [];
    this.tiposAsignaciones = [];
    this.productos = [];
    this.usuarios = [];
  }

  ngOnInit() {
    //do nothing
  }

}
