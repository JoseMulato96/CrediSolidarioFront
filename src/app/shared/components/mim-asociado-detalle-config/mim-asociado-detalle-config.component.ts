import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mim-asociado-detalle-config',
  templateUrl: './mim-asociado-detalle-config.component.html',
  styleUrls: ['./mim-asociado-detalle-config.component.css']
})
export class AsociadoDetalleConfigComponent implements OnInit {
  datosCabecera: any;
  datosDetalle: any;
  dropdown: boolean;
  @Input('configuracion')
  set configuracion(value: DetalleConfiguracion) {
    if (value && value.datos && value.datos.length > 0) {
      this.datosCabecera = value.datos.filter(item => item.nivel === 1);
      this.datosDetalle = value.datos.filter(item => item.nivel === 2);
      this.dropdown = value._dropdown;
    }
  }
  @Output() clickCeldaElement: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Inject(DOCUMENT) document: any,
    private readonly router: Router
  ) { }

  ngOnInit() {
    // do nothing
  }

  _toggle() {
    this.dropdown = !this.dropdown;
  }

  clickBoton(boton: any) {
    this.clickCeldaElement.emit({ boton });
  }
}

export class DetalleConfiguracion {
  numerNiveles = 1;
  datos: Dato[] = [];

  _dropdown = false;
}

export class Dato {
  nivel: number;
  clasesCss?: String;
  titulo?: EstructuraDato;
  valor?: EstructuraDato;
  boton?: EstructuraDato;
}

export class EstructuraDato {
  label?: String;
  iconoLeft?: String;
  iconoRight?: String;
  clasesCssTextButon?: String;
  clasesCss?: String;
  tipo?: String;
}
