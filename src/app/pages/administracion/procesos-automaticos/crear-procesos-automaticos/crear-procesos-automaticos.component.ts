import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@core/services';
import { FormValidate } from '@shared/util';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import cronstrue from 'cronstrue/i18n';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';


@Component({
  selector: 'app-crear-procesos-automaticos',
  templateUrl: './crear-procesos-automaticos.component.html',
})
export class CrearProcesosAutomaticosComponent extends FormValidate implements OnInit {

  isForm: Promise<any>;
  form: FormGroup;
  procesoAtomatico: any;
  tipoProcesoAutomatico: any;
  _esCreacion = true;
  nombreJob: string;
  grupoJob: string;
  subscription: Subscription = new Subscription();
  patterns = masksPatterns;
  conversionExpresionCron: String;
  _tipoProceso = false;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.nombreJob = params.jobName || null;
      this.grupoJob = params.jobGroup || null;
      this.backService.procesosAutomaticos.getTiposMovimientos({jobGroup: MIM_PARAMETROS.MIM_PROCESO_AUTOMATICO.JOB_GROUP, isPaged: false})
      .subscribe(item => {
        this.tipoProcesoAutomatico = item.content;
        if (this.nombreJob) {
          this.backService.procesosAutomaticos.getProcesoAutomatico(this.nombreJob, this.grupoJob)
            .subscribe((resp: any) => {
              this.procesoAtomatico = resp;
              this._esCreacion = false;
              this._tipoProceso = true;
              this._initForm(this.procesoAtomatico);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      });
    });
  }


  _initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        procesoAutomatico: [params ? this._tipoProcesoAutomatico(params.jobName) : null, [Validators.required]],
        cronExpresion: [params ? this._returnObjectCron(params.triggerList) : null, [Validators.required, Validators.maxLength(120)]],
        descripcion: [params ? params.jobDescription : null, [Validators.maxLength(250)]]
      }));
    this.conversionExpresionCronEspañol();
  }

  conversionExpresionCronEspañol() {
    this.form.controls.cronExpresion.valueChanges.subscribe(cron => {
      try {
        this.conversionExpresionCron = cron !== '' && cron !== null ? this.convertirCron(cron) : this.setErrorRequired();
      } catch (error) {
        this.form.controls.cronExpresion.setErrors({ 'incorrect': true });
      }
    });
  }

  convertirCron(cron: any) {
    return cronstrue.toString(cron, { locale: 'es' });
  }

  setErrorRequired() {
    this.form.controls.cronExpresion.setErrors({ 'required': true });
    return '';
  }

  _returnObjectCron(objec: any) {
    let cronExpresion;
    objec.forEach(element => {
      cronExpresion = element.cronExpression;
      this.conversionExpresionCron = cronstrue.toString(cronExpresion, { locale: 'es' });
    });
    return cronExpresion;
  }

  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  _crear() {
    const form: any = this.form.value;
    const param = {
      jobName: form.procesoAutomatico.jobName,
      jobGroup: form.procesoAutomatico.jobGroup,
      jobDescription: form.descripcion,
      durable: true,
      requestsRecovery: true,
      cronExpression: form.cronExpresion
    };
    this.backService.procesosAutomaticos.postProcesosAutomaticos(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.getRawValue();
    this.procesoAtomatico.jobName = form.procesoAutomatico.jobName;
    this.procesoAtomatico.jobGroup = form.procesoAutomatico.jobGroup;
    this.procesoAtomatico.jobDescription = form.descripcion;
    this.procesoAtomatico.cronExpression = form.cronExpresion;
    this.backService.procesosAutomaticos.putProcesosAutomaticos(this.nombreJob, this.grupoJob, this.procesoAtomatico).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINISTRACION_PROCESOS_AUTOMATICOS]);
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  _tipoProcesoAutomatico(jobName: string) {
    return this.tipoProcesoAutomatico.find(item => item.jobName === jobName);
  }

}
