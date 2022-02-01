import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';


@Component({
  selector: 'app-cotizar-proteccion',
  templateUrl: './cotizar-proteccion.component.html',
  styleUrls: ['./cotizar-proteccion.component.css']
})
export class CotizarProteccionComponent implements OnInit {

  fondos: any;
  tipoPlanes: any;
  planes: any;
  cualProyectoVida: any;
  rentaDiariaRecomendada: number;
  salarioMinimo: number;
  tipoCotizaciones: any;

  @Input('dataInit')
  set dataInit(value: any) {
    if (value === null || value === undefined) {
      return;
    }
    this.fondos = value.fondos;
    this.tipoPlanes = value.tipoPlanes;
    this.planes = value.planes;
    this.cualProyectoVida = value.cualProyectoVida;
    this.salarioMinimo = value.salarioMinimo.smmlv;
    this.rentaDiariaRecomendada = value.rentaDiariaRecomendada;
    this.tipoCotizaciones = value.tipoCotizaciones
  }

  constructor(public controlContainer: ControlContainer) { }

  ngOnInit(): void {
    // do nothing
  }

  ingresosMensuales() {
    const controlIngresos = this.controlContainer.control['controls'].ingresos;
    if (controlIngresos.value < this.salarioMinimo) {
      controlIngresos.setErrors({ ingresoError: true });
    }
  }
}
