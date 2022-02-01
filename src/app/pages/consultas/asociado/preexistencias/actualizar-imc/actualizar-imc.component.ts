import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DatosAsociado } from '@shared/models';
import { ES } from '@shared/components/mim-date-picker/mim-date-picker.component';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-actualizar-imc',
  templateUrl: './actualizar-imc.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ActualizarImcComponent extends FormValidate implements OnInit, OnDestroy {

  @Input()
  asoNumInt: string;
  asociado: DatosAsociado;
  asociadoSubscription: any;

  @Output()
  saveImc: EventEmitter<any> = new EventEmitter();
  open = false;
  form: FormGroup;
  isForm: Promise<any>;
  causas: any[];
  examenes: any[];
  diagnosticos: any[];
  es = ES;
  maxDateValue: any;
  minDateValue: any;

  imc: number;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }


  ngOnInit() {
    this.asociadoSubscription = this.dataService
      .asociados()
      .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
        if (
          !respuesta ||
          respuesta.datosAsociado.numInt !== this.asoNumInt
        ) {
          return;
        }
        // Inicializa datos del asociado.
        this.asociado = respuesta.datosAsociado;

        this._initForm();

      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  ngOnDestroy() {
    if (this.asociadoSubscription) {
      this.asociadoSubscription.unsubscribe();
      this.asociadoSubscription = undefined;
    }
  }

  /**
   * @description Inicializa el formulario de update IMC
   *@author Bayron Andres Perez Muñoz
   */
  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        peso: new FormControl(null, [Validators.required]),
        estatura: new FormControl(null, [Validators.required]),
        imc: new FormControl(null),
      }));
    this.form.controls.peso.disable();
    this._changuesValuesImc();
  }

  _changuesValuesImc() {
    this.form.controls.peso.valueChanges.subscribe(resp => {
      this.imc = 0;
      if (this.form.controls.estatura.value) {
        const estatura = this.form.controls.estatura.value.toString().includes(',') ? this.form.controls.estatura.value.toString().replace(',', '.') : this.form.controls.estatura.value;
        this.imc = +resp / Math.pow(+estatura, 2);
      }
    });

    this.form.controls.estatura.valueChanges.subscribe(resp => {
      this.imc = 0;
      if (this.form.controls.peso.value) {
        resp = resp.includes(',') ? resp.replace(',', '.') : resp;
        this.imc = +this.form.controls.peso.value / Math.pow(+resp, 2);
      }
      this.form.controls.peso.enable();
    });
  }

  _resetForm() {
    this.form.reset();
    this._initForm();
  }

  onOpen() {
    this.open = !this.open;
    this._resetForm();
  }

  /**
   * @description Captura evento al guardar una preexistencia.
   *
   */
  _onSaveImc() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
      return;
    }

    this._saveImc();
  }

  /**
   * @description Almacena una preexistencia
   *
   */
  _saveImc() {
    const indiceMasaCorporal = {
      asoNumInt: this.asoNumInt,
      peso: this.form.controls.peso.value,
      estatura: this.form.controls.estatura.value,
      imc: this.imc,
    };
    this.backService.preexistencia.crearImc(indiceMasaCorporal).subscribe((response: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text);
      });

      // Cerramos el modal.
      this.onOpen();
      // Emitimos el guardado al componente padre.
      this.saveImc.emit(response);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
}
