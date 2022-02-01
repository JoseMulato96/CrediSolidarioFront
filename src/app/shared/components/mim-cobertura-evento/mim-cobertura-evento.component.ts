import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { forkJoin, Observable } from 'rxjs';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-mim-cobertura-evento',
  templateUrl: './mim-cobertura-evento.component.html',
})
export class MimCoberturaEventoComponent extends FormValidate implements OnInit , FormComponent {

  formCoberturas: FormGroup;
  isForm: Promise<any>;

  nombreCobertura: string;
  conceptoMedico: any[];
  razonesNegacion: any[];
  mostrarRazonesNegacion: boolean;
  codigoPlan: number;
  codigoCobertura: number;
  _datoConceptoMedico: any;

  @Input() faseFlujo: number;
  @Input() eventoDetalle: any;
  @Output() datoCoberturaEvento = new EventEmitter<any>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.conceptoMedico = [];
    this.razonesNegacion = [];
    this.nombreCobertura = '';
  }

  ngOnInit() {
    this._getData();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.formCoberturas = this.formBuilder.group({
        conceptoMedico: new FormControl(param && param.mimConceptoAuditor ?
          this._setConceptoMedico(param.mimConceptoAuditor.codigo) : null, [Validators.required]),
        razonesNegacion: new FormControl(param && param.mimRazonNegacionAuditor ?
          this._setRazonNegacion(param.mimRazonNegacionAuditor.codigo) : null)
      })
    );

    if (param) {
      this.codigoPlan = param.codigoPlan;
      this.codigoCobertura = param.codigoCobertura;
      this.nombreCobertura = param.mimEventoCoberturaPortafolioDto.nombre;
      if (param.mimConceptoAuditor && param.mimConceptoAuditor.codigo) {
        this._datoConceptoMedico = param.mimConceptoAuditor;
        this._cargarRazonNegacion(param.mimConceptoAuditor.codigo);
      }
    }

    this._change();
  }

  _setConceptoMedico(codigo: string) {
    return this.conceptoMedico.find(item => item.codigo === codigo);
  }

  _setRazonNegacion(codigo: string) {
    return this.razonesNegacion.find(item => item.codigo === codigo);
  }

  _change() {
    this.formCoberturas.controls.conceptoMedico.valueChanges.subscribe(datoConceptoMedico => {
      if (datoConceptoMedico) {
        this._datoConceptoMedico = datoConceptoMedico;
        this._cargarRazonNegacion(datoConceptoMedico.codigo);
      }
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });


    this.formCoberturas.controls.razonesNegacion.valueChanges.subscribe(datoRazonNegacion => {

      if (datoRazonNegacion) {
        const coberturaEvento = {
          codigoPlan: this.codigoPlan,
          codigoCobertura: this.codigoCobertura,
          conceptoTareaFlujo: this._datoConceptoMedico,
          razonNegacion: datoRazonNegacion,
        };

        this.datoCoberturaEvento.emit(coberturaEvento);
      }

    });

  }

  _cargarRazonNegacion(codigoConceptoAuditor: number) {
    this.mostrarRazonesNegacion = codigoConceptoAuditor === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_DEFINICION_DESFAVORABLE ||
    codigoConceptoAuditor === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_PAGO_DESFAVORABLE ? true : false;
    if (this.mostrarRazonesNegacion) {
      this.formCoberturas.controls.razonesNegacion.setErrors({'required': true});
      this.formCoberturas.controls.razonesNegacion.updateValueAndValidity({emitEvent : false});
      this.formCoberturas.controls.razonesNegacion.enable();
    } else {
      this.formCoberturas.controls.razonesNegacion.setValue(null);
      this.formCoberturas.controls.razonesNegacion.setErrors(null);
      this.formCoberturas.controls.razonesNegacion.disable();
    }

    const coberturaEvento = {
      codigoPlan: this.codigoPlan,
      codigoCobertura: this.codigoCobertura,
      conceptoTareaFlujo: this._datoConceptoMedico,
      razonNegacion: null,
      cambioConcepto: true
    };

    this.datoCoberturaEvento.emit(coberturaEvento);
  }

  _getData() {

    forkJoin([
      this.backService.conceptoTareaFlujo.getConceptoTareaFlujo({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.MEDICAMENTOS,
        'mimFaseFlujo.codigo': this.faseFlujo
      })
    ]).subscribe(([
      _conceptoMedico
    ]) => {
      this.conceptoMedico = _conceptoMedico._embedded.mimConceptoTareaFlujo;
      this.conceptoMedico.unshift({codigo: null, nombre: 'Seleccionar'});
      this.backService.razonNegacion.getRazonesNegacion({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.MEDICAMENTOS,
        'mimFaseFlujo.codigo': this.faseFlujo
      }).subscribe((item: any) => {
        this.razonesNegacion = item._embedded.mimRazonNegacion || null;
        this._initForm(this.eventoDetalle);
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

    }, (err: any) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.formCoberturas) && this.formCoberturas && this.formCoberturas.dirty;
  }

}
