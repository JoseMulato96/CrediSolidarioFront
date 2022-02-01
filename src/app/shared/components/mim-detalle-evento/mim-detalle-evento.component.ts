import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-mim-detalle-evento',
  templateUrl: './mim-detalle-evento.component.html',
})
export class MimDetalleEventoComponent extends FormValidate implements OnInit , FormComponent {

  formDetalleEvento: FormGroup;
  isForm: Promise<any>;

  nombreCobertura: string;
  codigoPlan: number;
  codigoCobertura: number;
  valorProteccion: number;

  @Input() faseFlujo: number;
  @Input() eventoDetalle: any;
  @Input() valoresAPagar: any;
  @Input() codigoSublimite: string;
  @Output() datoDetalleEvento = new EventEmitter<any>();

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    super();
    this.nombreCobertura = '';
    this.valorProteccion = 0;
  }

  ngOnInit() {
    this._initForm(this.eventoDetalle);
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.formDetalleEvento = this.formBuilder.group({
        valorProteccionBase: new FormControl(param ? param.valorProteccionBase : 0, [Validators.required])
      })
    );

    if (param) {
      this.codigoPlan = param.mimLiquidacionDetallePK.codigoPlan;
      this.codigoCobertura = param.mimLiquidacionDetallePK.codigoCobertura;
      this.nombreCobertura = param.mimEventoCoberturaPortafolioDto.nombre;
      this.valorProteccion = param ? param.valorProteccion : 0;
    }
  }

  _validarValorBase() {
    let datoValorProteccionBase = this.formDetalleEvento.value.valorProteccionBase;
    let superaTope = false;

    if (!isNaN(+datoValorProteccionBase) && isFinite(+datoValorProteccionBase)) {
      const datoValorAPagar = this._setValoresAPagar(this.codigoPlan, this.codigoCobertura);

      // Si la cobertura seleccionada tiene un sublimite
      if (this.codigoSublimite) {

        const valorProteccionBaseSublimite = datoValorAPagar.valorProteccionBaseSublimite;
        if (valorProteccionBaseSublimite > 0) {
          if (datoValorProteccionBase > valorProteccionBaseSublimite) {
            datoValorProteccionBase = valorProteccionBaseSublimite;
          }
        } else {
          datoValorProteccionBase = 0;
          superaTope = true;
        }

      // Si la cobertura seleccionada NO tiene un sublimite
      } else {
        const valorProteccionBaseSinSublimite = datoValorAPagar.valorProteccionBaseSinSublimite;
        if (valorProteccionBaseSinSublimite > 0) {
          if (datoValorProteccionBase > valorProteccionBaseSinSublimite) {
            datoValorProteccionBase = valorProteccionBaseSinSublimite;
          }
        } else {
          datoValorProteccionBase = 0;
          superaTope = true;
        }

      }

      // Se vuelve a setear el valor
      this.formDetalleEvento.controls.valorProteccionBase.setValue(datoValorProteccionBase);

      const detalleEvento = {
        codigoPlan: this.codigoPlan,
        codigoCobertura: this.codigoCobertura,
        valorProteccionBase: datoValorProteccionBase,
        superaTope: superaTope
      };

      this.datoDetalleEvento.emit(detalleEvento);
    }
  }

  _setValoresAPagar(codigoPlan: number, codigoCobertura) {
    return this.valoresAPagar.find(item => item.codigoPlan === codigoPlan && item.codigoCobertura === codigoCobertura);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.formDetalleEvento) && this.formDetalleEvento && this.formDetalleEvento.dirty;
  }

}
