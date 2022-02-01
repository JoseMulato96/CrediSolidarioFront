import { Component, Input, OnInit } from '@angular/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { MimAccordionSectionConfiguration } from '../mim-accordion-section/mim-accordion-section.component';

export class MimFormaPagoComponentConfiguracion {
  mimFormaPago: any; // Corresponde a la entidad MimFormaPago
  informacionFormaPago: any[];
}

@Component({
  selector: 'app-mim-forma-pago',
  templateUrl: './mim-forma-pago.component.html'
})
export class MimFormaPagoComponent implements OnInit {

  datosFormaPagoMimAccordionSectionConfiguration: MimAccordionSectionConfiguration;
  mimFormaPagoComponentConfiguracion: MimFormaPagoComponentConfiguracion;

  @Input('configuracion')
  set configuracion(value: any) {
    this.mimFormaPagoComponentConfiguracion = value;
    this.construirDatosFormaPagoMimPersonaDetalleConfiguracion();
  }

  constructor() {
    // do nothing
  }

  ngOnInit() {
    // do nothing
  }

  private construirDatosFormaPagoMimPersonaDetalleConfiguracion() {
    this.datosFormaPagoMimAccordionSectionConfiguration = new MimAccordionSectionConfiguration();
    this.datosFormaPagoMimAccordionSectionConfiguration.title = 'liquidaciones.detalleLiquidacion.formaPago';
    this.datosFormaPagoMimAccordionSectionConfiguration.description = this.mimFormaPagoComponentConfiguracion.mimFormaPago.nombre;

    switch (this.mimFormaPagoComponentConfiguracion.mimFormaPago.codigo) {
      case MIM_PARAMETROS.MIM_FORMA_PAGO.CHEQUE:
        this.datosFormaPagoMimAccordionSectionConfiguration.collapsable = true;
        break;
      case MIM_PARAMETROS.MIM_FORMA_PAGO.DEPOSITOS:
        this.datosFormaPagoMimAccordionSectionConfiguration.collapsable = true;
        break;
      case MIM_PARAMETROS.MIM_FORMA_PAGO.DISTRIBUCION:
        this.datosFormaPagoMimAccordionSectionConfiguration.collapsable = false;
        break;
    }
  }


}
