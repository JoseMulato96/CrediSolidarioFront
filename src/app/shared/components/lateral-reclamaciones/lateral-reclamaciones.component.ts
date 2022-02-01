import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators, FormValidate } from '@shared/util';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-lateral-reclamaciones',
  templateUrl: './lateral-reclamaciones.component.html',
})
export class LateralReclamacionesComponent extends FormValidate implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;
  patterns = masksPatterns;

  @Input() mostralModalReclamacion: boolean;
  @Output() ocultarModal = new EventEmitter<boolean>();
  @Output() datosForm = new EventEmitter<any>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    ) {
    super();
   }

  ngOnInit() {
    this._initForm();
  }

  _toggleObservaciones() {
    this.mostralModalReclamacion = false;
    this.ocultarModal.emit(false);
    this._limpiar();
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        identificacion: new FormControl(null, [Validators.maxLength(15)]),
        liquidacion: new FormControl(null, [Validators.maxLength(20)])
      }));
      this.form.controls.identificacion.valueChanges.subscribe((item: any) => {
        if (item) {
          this.form.controls.liquidacion.setValue(null);
        }
      });
      this.form.controls.liquidacion.valueChanges.subscribe(item => {
        if (item) {
          this.form.controls.identificacion.setValue(null);
        }
      });
  }

  onConsultar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });
      return;
    }
    if (
      CustomValidators.CampoVacio(this.form.get('identificacion').value) &&
      CustomValidators.CampoVacio(this.form.get('liquidacion').value)
    ) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe((response: string) => {
          this.alertService.warning(response);
        });
      return;
    }
    this.datosForm.emit({
      identificacion: this.form.get('identificacion').value,
      liquidacion: this.form.get('liquidacion').value,
      tipoFiltro: this.form.get('identificacion').value ? 1 : 2,
      radicacion: true
    });
    this._toggleObservaciones();
  }

  _limpiar() {
    this.form.reset();
    this._initForm();
  }

}
