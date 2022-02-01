import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';


@Component({
  selector: 'app-tipo-calculo',
  templateUrl: './tipo-calculo.component.html',
  styleUrls: ['./tipo-calculo.component.css']
})
export class TipoCalculoComponent implements OnInit {

  tipoCalculo: number;
  porcentajeCuota: any;
  mimCotizacion: any;
  mostrarFormularioCoberturas: boolean;
  porcentajeValorCuota: any;

  dataInitCoberturas: any;

  @Input('dataInit')
  set dataInit(value: any) {
    if (value === null || value === undefined) {
      return;
    }

    this.porcentajeCuota = value.porcentajeCuota;
    this.mimCotizacion = value.mimCotizacion;

    // Configuramos data de iniciacion (Configuracion) de componentes hijos.
    this.dataInitCoberturas = {
      mimCotizacion: this.mimCotizacion,
      mimPlanCobertura: value.mimPlanCobertura
    };

    // Esta variable se muestra al lado del slider. Si no viene informada en mimCotizacion
    // sera por defecto el valor minimo permitido en la configuracion de porcentajeCuota.
    // La configuramos solo si debemos mostrar el slider.
    if (this.mostrarSlider()) {
      this.porcentajeValorCuota = this.mimCotizacion !== null && this.mimCotizacion !== undefined
        && this.mimCotizacion.porcentajeValorCuota !== null && this.mimCotizacion.porcentajeValorCuota !== undefined ?
        +((this.mimCotizacion.porcentajeValorCuota) * 100).toFixed(4) : this.porcentajeCuota.porcentajeMinimo;
    }
  }

  constructor(
    public controlContainer: ControlContainer
  ) {
  }

  ngOnInit() {
    //do nothing
  }

  public cambiarTipoCalculo(event: any) {
    this.tipoCalculo = +event.target.value;
    // Validar si el tipo de calculo es cuota
    if (this.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION) {
      this.mimCotizacion = {
        ...this.mimCotizacion,
        tipoCalculo: this.tipoCalculo
      };
      if (this.porcentajeCuota && this.porcentajeCuota.porcentajeMinimo) {
        this.porcentajeValorCuota = this.porcentajeCuota.porcentajeMinimo;
        this.controlContainer.control['controls'].valorCuota.setValue(this.porcentajeCuota.porcentajeMinimo);
      }
    }

    // Validar si el tipo de calculo es protección
    if (this.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION) {
      this.mimCotizacion = {
        ...this.mimCotizacion,
        tipoCalculo: this.tipoCalculo
      };
      this.porcentajeValorCuota = 0;
      this.controlContainer.control['controls'].valorCuota.setValue(0);
    }
  }

  public alMoverSlider(e) {
    // Se actualiza el valor del control para capturar el evento en el formulario padre.
    this.controlContainer.control['controls'].valorCuota.setValue(e.value);
  }

  public alCambiarSlider(e) {
    // Se actualiza el label del control mientras se mueve.
    this.porcentajeValorCuota = e.value;
  }

  public mostrarSlider() {
    this.tipoCalculo = parseInt(this.controlContainer.control['controls'].rdTipoCalculo.value, 10);

    return (this.porcentajeCuota !== null && this.porcentajeCuota !== undefined)
      && (this.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA
        || this.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION);
  }

}
