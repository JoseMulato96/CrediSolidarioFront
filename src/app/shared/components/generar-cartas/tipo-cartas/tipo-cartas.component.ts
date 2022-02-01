import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tipo-cartas',
  templateUrl: './tipo-cartas.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TipoCartasComponent),
      multi: true
    }
  ]
})
export class TipoCartasComponent extends FormValidate implements OnInit, ControlValueAccessor, OnDestroy {

  // Este es el modelo del componente (Modelo del input)
  mimTipoCartaSet: any;
  cartaExistente: boolean;
  subscriptions: Subscription[] = [];
  addForm: FormGroup;
  isAddForm: Promise<any>;
  isDisabled: boolean;
  tiposCartas: any;

  @Input('dataInitTipoCarta')
  set dataInitTipoCarta(value: any) {
    if (value === null || value === undefined) {
      return;
    }
    this.tiposCartas = value.tiposCartas || [];
    this.cartaExistente = value.cartaExistente || false;

  }

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService
  ) {
    super();
  }

  get value(): any {
    return this.mimTipoCartaSet;
  }

  set value(value: any) {
    this.mimTipoCartaSet = JSON.parse(JSON.stringify(value)) || [];
    this.onChange(this.mimTipoCartaSet);
    this.onTouched();
  }

  onChange: any = () => {
    // do nothing
  };
  onTouched: any = () => {
    // do nothing
  };

  writeValue(value: any): void {
    this.mimTipoCartaSet = JSON.parse(JSON.stringify(value)) || [];
    this.cartaExistente = false;
    if (this.mimTipoCartaSet.length > 0) {
      this.cartaExistente = true;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.initAddForm();
  }

  private initAddForm(param?: any) {
    this.isAddForm = Promise.resolve(
      this.addForm = this.formBuilder.group({
        tipoCarta: [null, [Validators.required]]
      })
    );
  }

  private limpiar() {
    this.addForm.reset();
  }

  private setValue(value: any) {
    this.mimTipoCartaSet = value || [];
    this.onChange(this.mimTipoCartaSet);
    this.onTouched();
  }

  diligenciar() {
    if (this.addForm.invalid) {
      this.validateForm(this.addForm);

      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });
      return;
    }

    this.mimTipoCartaSet = this.addForm.controls.tipoCarta.value;

    // Siempre que registremos (Ya sea para una creacion o edicion) notificamos al componente padre.
    this.setValue(this.mimTipoCartaSet);
  }

}
