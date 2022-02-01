import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MIM_PARAMETROS } from '../../../static/constantes/mim-parametros';
import { FormValidate } from '../../../util';

@Component({
  selector: 'app-admin-coberturas',
  templateUrl: './admin-coberturas.component.html',
  styleUrls: ['./admin-coberturas.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminCoberturasComponent),
      multi: true
    }
  ]
})
export class AdminCoberturasComponent extends FormValidate implements OnInit, ControlValueAccessor, OnDestroy {

  subscriptions: Subscription[] = [];

  mimCotizacion: any;
  // Este es el modelo del componente (Modelo del input)
  mimCotizacionDetalleSet: any;
  mimCotizacionDetalleIndex: number;

  addForm: FormGroup;
  isAddForm: Promise<any>;
  isDisabled: boolean;
  mostrarFormularioCoberturas: boolean;
  esCreacion: boolean;
  mimPlanCoberturaSet: any;
  tipoCalculo: any;
  bloquearEliminar: boolean;

  @Input('dataInitCoberturas')
  set dataInitCoberturas(value: any) {
    if (value === null || value === undefined) {
      return;
    }

    this.mimPlanCoberturaSet = value.mimPlanCobertura && value.mimPlanCobertura.length > 0 ? value.mimPlanCobertura : this.mimPlanCoberturaSet;

    if (value.mimPlanCobertura && this.mimCotizacionDetalleSet) {
      this.validDataCobertura();
    }

    this.mimCotizacion = value.mimCotizacion;
    this.tipoCalculoChange();

    // Inicializamos el formulario de creacion y edicion.
    this.esCreacion = true;
    this.initAddForm();
  }

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) {
    super();
    this.mimPlanCoberturaSet = [];
  }

  get value(): any {
    return this.mimCotizacionDetalleSet;
  }

  set value(value: any) {
    this.mimCotizacionDetalleSet = JSON.parse(JSON.stringify(value)) || [];
    this.onChange(this.mimCotizacionDetalleSet);
    this.validDataCobertura();
    this.onTouched();
  }

  onChange: any = () => { 
    // do nothing
  };
  
  onTouched: any = () => {
    // do nothing
  };

  writeValue(value: any): void {
    this.mimCotizacionDetalleSet = JSON.parse(JSON.stringify(value)) || [];
    this.bloquearEliminar = false;
    if (this.mimCotizacionDetalleSet.filter(item => !item.mimCotizacionDetalleRelacionado).length === 1) {
      this.bloquearEliminar = true;
    }
    this.validDataCobertura();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    //do nothing
  }

  private initAddForm(param?: any) {
    this.isAddForm = Promise.resolve(
      this.addForm = this.formBuilder.group({
        codigoPlanCobertura: [param ? param.mimPlanCobertura.codigo : null],
        mimPlanCobertura: [param ? this.getMimPlanCobertura(param.mimPlanCobertura.codigo) : null, [Validators.required]],
        valorProteccion: [param ? Math.round(param.valorProteccion).toString().replace('.', ',') : null],
        cuota: [param ? Math.round(param.cuota).toString().replace('.', ',') : null],
        sipFactores: [param ? param.factor : null],
      })
    );

    if (this.mimCotizacion && this.mimCotizacion.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION) {
      this.addForm.controls.valorProteccion.setValidators([Validators.required]);
      this.addForm.controls.cuota.disable();
      this.addForm.controls.valorProteccion.enable();
      this.addForm.controls.cuota.setErrors(null);
      this.addForm.controls.valorProteccion.setErrors({ required: true });
    } else {
      this.addForm.controls.cuota.setValidators([Validators.required]);
      this.addForm.controls.cuota.enable();
      this.addForm.controls.valorProteccion.disable();
      this.addForm.controls.cuota.setErrors({ required: true });
      this.addForm.controls.valorProteccion.setErrors(null);
    }

    if (this.esCreacion) {
      this.addForm.controls.mimPlanCobertura.enable();
    } else {
      this.addForm.controls.mimPlanCobertura.disable();
    }
  }

  private getMimPlanCobertura(codigo: any) {
    return this.mimPlanCoberturaSet.find(mimPlanCobertura => mimPlanCobertura.codigo === codigo);
  }

  agregarCobertura() {
    this.mostrarFormularioCoberturas = true;
    this.esCreacion = true;
    this.initAddForm();
  }

  cancelarAgregarCobertura() {
    this.validDataCobertura();
    this.limpiar();
  }

  registrar() {
    if (this.addForm.invalid) {
      this.validateForm(this.addForm);

      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });

      return;
    }

    this.translate.get('global.alertas.deseaCrearEditarRegistro').subscribe(mensaje => {
      this.alertService.confirm(mensaje).then(resp => {
        if (resp) {

          if (this.esCreacion) {
            const _form = this.addForm.getRawValue();

            const mimCotizacionDetalle = {
              codigoPlanCobertura: _form.mimPlanCobertura.codigo,
              mimPlanCobertura: _form.mimPlanCobertura,
              valorProteccion: _form.valorProteccion,
              cuota: _form.cuota,
              sipFactores: _form.sipFactores
            };

            this.mimCotizacionDetalleSet.push(mimCotizacionDetalle);

          } else {
            const _form = this.addForm.getRawValue();
            _form.cuota = parseInt(_form.cuota, 10);
            _form.valorProteccion = parseInt(_form.valorProteccion, 10);
            this.mimCotizacionDetalleSet[this.mimCotizacionDetalleIndex] = _form;
          }

          this.validDataCobertura();
          this.limpiar();

          // Siempre que registremos (Ya sea para una creacion o edicion) notificamos al componente padre.
          this.setValue(this.mimCotizacionDetalleSet);
        }
      });
    });

  }

  editarCobertura(event: any, index: number) {
    this.esCreacion = false;
    this.mostrarFormularioCoberturas = true;

    this.validDataCobertura();

    if (!this.mimPlanCoberturaSet.find(mimPlanCobertura => mimPlanCobertura.codigo === event.mimPlanCobertura.codigo)) {
      this.mimPlanCoberturaSet.push(event.mimPlanCobertura);
    }

    this.initAddForm(event);
    this.mimCotizacionDetalleIndex = index;
  }

  eliminarCobertura(event: any, index: number) {
    this.translate.get('global.alertas.eliminar').subscribe(mensaje => {
      this.alertService.confirm(mensaje).then(resp => {
        if (resp) {
          this.mimCotizacionDetalleSet = this.mimCotizacionDetalleSet.filter(mimCotizacionDetalle => mimCotizacionDetalle !== event);
          this.validDataCobertura();
          if (!(this.mimPlanCoberturaSet && this.mimPlanCoberturaSet.find(mimPlanCobertura => mimPlanCobertura.codigo === event.mimPlanCobertura.codigo))) {
            this.mimPlanCoberturaSet.push(event.mimPlanCobertura);
          }
          this.mostrarFormularioCoberturas = false;

          // Notificamos al componente padre que hubo un cambio en el modelo.
          this.setValue(this.mimCotizacionDetalleSet);
        }
      });
    });
  }

  private limpiar() {
    this.mostrarFormularioCoberturas = false;
    this.esCreacion = true;
    this.addForm.reset();
    this.mimCotizacionDetalleIndex = null;
  }

  private setValue(value: any) {
    this.mimCotizacionDetalleSet = value || [];
    this.onChange(this.mimCotizacionDetalleSet);
    this.onTouched();
  }

  private tipoCalculoChange() {
    if (this.tipoCalculo && this.tipoCalculo !== this.mimCotizacion?.tipoCalculo) {
      this.validDataCobertura();
      this.limpiar();
    }
    this.tipoCalculo = this.mimCotizacion?.tipoCalculo;
  }

  private validDataCobertura() {
    if (this.mimPlanCoberturaSet) {
      this.mimPlanCoberturaSet = this.mimPlanCoberturaSet.filter(mimPlanCobertura =>
        !this.mimCotizacionDetalleSet.find(_mimCotizacionDetalle => _mimCotizacionDetalle.codigoPlanCobertura === mimPlanCobertura.codigo));
    }
  }

}
