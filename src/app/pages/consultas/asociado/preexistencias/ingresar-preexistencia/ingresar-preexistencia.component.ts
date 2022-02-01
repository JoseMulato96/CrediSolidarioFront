import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PreexistenciasService } from '../../../../../core/services/api-back.services/mimutualasociados/preexistencias.service';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { SipParametrosService } from '@core/services/api-back.services/mimutualutilidades/sip-parametros.service';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { masksPatterns } from '@shared/util/masks.util';
import { ES } from '@shared/components/mim-date-picker/mim-date-picker.component';
import { DiagnosticosService } from '../../../../../core/services/api-back.services/mimutualutilidades/diagnosticos.service';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DatosAsociado } from '@shared/models';
import { DateUtil } from '@shared/util/date.util';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-ingresar-preexistencia',
  templateUrl: './ingresar-preexistencia.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./ingresar-preexistencia.component.css']
})
export class IngresarPreexistenciaComponent extends FormValidate implements OnInit, OnDestroy {

  @Input()
  asoNumInt: string;
  asociado: DatosAsociado;
  asociadoSubscription: any;
  @Output()
  savePreexistencia: EventEmitter<any> = new EventEmitter();
  open = false;
  form: FormGroup;
  isForm: Promise<any>;
  causas: any[];
  examenes: any[];
  diagnosticos: any[];
  patterns = masksPatterns;
  es = ES;
  maxDateValue: any;
  minDateValue: any;

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

        // Calcula fecha minima y  fecha maxima.
        this.minDateValue = new Date(this.asociado.fecNac);
        this.maxDateValue = new Date();

        this._initForm();
        this.getCausas();
        this.getExamenes();
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
   * @description Inicializa el formulario de creaci;ón de preexistencia
   *
   */
  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        diagnostico: new FormControl(null, [Validators.required]),
        causa: new FormControl(null, [Validators.required]),
        examen: new FormControl(null, [Validators.required]),
        calificacion: new FormControl(null, [Validators.required, Validators.required, Validators.max(8), Validators.min(1)]),
        fechaInicio: new FormControl(null, [Validators.required]),
        observaciones: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        cobertura: new FormControl()
      }));
  }

  /**
   * @description Realiza un reset al formulario.
   *
   */
  _resetForm() {
    this.form.reset();
    this._initForm();
  }

  /**
   * @description Se encarga de abrir el modal de ingreso.
   *
   */
  onOpen() {
    this.open = !this.open;

    this._resetForm();
  }

  /**
   * @description Captura evento al guardar una preexistencia.
   *
   */
  _onSavePreexistencia() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
      return;
    }

    this._savePreexistencia();
  }

  /**
   * @description Almacena una preexistencia
   *
   */
  _savePreexistencia() {
    const preexistencia = {
      asoNumInt: this.asoNumInt,
      prePuntaje: this.form.controls.calificacion.value,
      preCausa: this.form.controls.causa.value.sipParametrosPK.codigo,
      preExamen: this.form.controls.examen.value.sipParametrosPK.codigo,
      preDesc: this.form.controls.observaciones.value,
      preFechaInicio: DateUtil.dateToString(this.form.controls.fechaInicio.value, GENERALES.FECHA_PATTERN),
      diagCod: {
        diagCod: this.form.controls.diagnostico.value.diagCod
      },
      preCobertura: String(this.form.controls.cobertura.value ?
        SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.SIP_PARAMETROS.SI :
        SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.SIP_PARAMETROS.NO)
    };
    this.backService.preexistencia.crearPreexistencia(preexistencia).subscribe((response: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text);
      });

      // Cerramos el modal.
      this.onOpen();

      // Emitimos el guardado al componente padre.
      this.savePreexistencia.emit(response);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * @description Obtiene las causas
   *
   */
  getCausas() {
    this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPO_CAUSAS_PREEXISTENCIAS.TIP_COD)
      .subscribe((response: any) => {
        this.causas = response.sipParametrosList;
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  /**
   * @description Obtiene los examenes
   *
   */
  getExamenes() {
    this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.TIP_COD)
      .subscribe((response: any) => {
        this.examenes = response.sipParametrosList;
      }, (err: any) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  /**
   *
   * @description Obtiene diagnosticos
   * @param event Captura eventos del autocompletar.
   */
  getDiagnosticos(event: any) {
    this.backService.diagnostico.getDiagnosticos(event.query).subscribe((response: any) => {
      this.diagnosticos = response;
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * @description Controla rango de numberos en la calificacion.
   *
   */
  _onKeyUp() {
    if (this.form.controls.calificacion.value < 0) {
      this.form.controls.calificacion.setValue(0);
    } else if (this.form.controls.calificacion.value > 8) {
      this.form.controls.calificacion.setValue(8);
    }
  }
}
