import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidate, CustomValidators } from '@shared/util';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-formula-plan-graves',
  templateUrl: './guardar-formula-plan.component.html',
})
export class GuardarFormulaPlanComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoFormulaPlan: string;
  fondo: any;
  formulaPlanItem: any;
  planes: any[];
  tiposFormulaPlan: any[] = [];
  patterns = masksPatterns;
  validateForm: any;
  isPristine: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoFormulaPlan = params.codigoFormulaPlan;


      forkJoin([
        this.backService.tipoFormulaPlan.getTiposFormulaPlan({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
        this.backService.planes.getPlanes(({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }))
      ]).subscribe(([
        _tiposFormulaPlan,
        _planes
      ]) => {
        this.tiposFormulaPlan = _tiposFormulaPlan._embedded.mimTipoFormulaPlan;
        this.planes = _planes.content;
        if (this.codigoFormulaPlan) {
          this.backService.formulaPlan.getFormulaPlan(this.codigoFormulaPlan)
            .subscribe((resp: any) => {
              this.formulaPlanItem = resp;
              if (!this.formulaPlanelected(resp.mimTipoFormulaPlan.codigo)) {
                this.tiposFormulaPlan.push(resp.mimTipoFormulaPlan);
              }
              this._esCreacion = false;
              this._initForm(resp);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.form.reset();
        this._initForm();
        this.frontService.alert.warning(err.error.message);
      });

    });
  }

  /**
   * Autor: Bayron Perez
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        plan: new FormControl(param ? this.planSelected(param.mimPlan.codigo) : null, [Validators.required]),
        tipoFormulaPlan: new FormControl(param ? this.formulaPlanelected(param.mimTipoFormulaPlan.codigo) : null, [Validators.required]),
        formula: new FormControl(param ? param.mimTipoFormulaPlan.formula : null, [Validators.required, CustomValidators.vacio, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1\,\. ]')]),
        descripcion: new FormControl(param ? param.mimTipoFormulaPlan.descripcion : null, [Validators.required, CustomValidators.vacio, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1\,\. ]')]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

    if (this._esCreacion) {
      this.form.controls.vigente.setValue(true);
      this.form.controls.vigente.disable();
      this.form.controls.formula.disable();
      this.form.controls.descripcion.disable();
    }
    if (!this._esCreacion) {
      this.form.controls.formula.disable();
      this.form.controls.descripcion.disable();
      this.form.controls.plan.disable();
      this.form.controls.tipoFormulaPlan.disable();
    }
    this.valueChangues();
  }

  valueChangues(){
    this.form.controls.tipoFormulaPlan.valueChanges.subscribe(tipoFormulaPlan => {
      if(!tipoFormulaPlan){return;}
      this.form.controls.formula.setValue(tipoFormulaPlan.formula);
      this.form.controls.descripcion.setValue(tipoFormulaPlan.descripcion);
  });
  }
  /**
   *
   * Autor: Bayron Andres Perez
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  formulaPlanelected(codigo: string) {
    return this.tiposFormulaPlan.find(x => x.codigo === codigo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
   */
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

  /**
   * Autor: Bayron Andres Perez Muñoz
   * Función: Crea un Enfermedad Grave
   */
  _crear() {
    this.form.updateValueAndValidity();
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      mimPlanList: form.plan.map(plan => {
        const codigo = { codigo: plan.codigo };
        return codigo;
      }),
      mimTipoFormulaPlan: { codigo: form.tipoFormulaPlan.codigo },
      formula: this.form.controls.formula.value,
      descripcion: this.form.controls.descripcion.value,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: true,
    };

    this.backService.formulaPlan.postFormulaPlan(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Modifica la información del fondo
   */
  _actualizar() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      codigo: this.formulaPlanItem.codigo,
      mimPlan: { codigo: this.form.controls.plan.value.codigo },
      mimTipoFormulaPlan: { codigo: this.form.controls.tipoFormulaPlan.value.codigo },
      formula: this.form.controls.formula.value,
      descripcion: this.form.controls.descripcion.value,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: this.form.controls.vigente.value
    };
    this.backService.formulaPlan.putFormulaPlan(this.codigoFormulaPlan, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Bayron Andres Perez
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FORMULA_PLAN]);
  }

  private planSelected(codigo: any) {
    return this.planes ? this.planes.find(resp => resp.codigo === codigo) : null;
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }


}
