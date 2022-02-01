import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-guardar-nivel-riesgo-plan',
  templateUrl: './guardar-nivel-riesgo-plan.component.html',
})
export class GuardarNivelRiesgoPlanComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoPlan: string;
  codigoNivelRiesgo: any;
  fondo: any;
  plan: any;
  nivelRiesgo: any;
  nivelRiesgoPlan: any;

  fondos: any[] = [];
  planes: any[] = [];
  nivelesRiesgos: any[] = [];
  nivelesRiesgosPlanes: any[] = [];
  estadoFecha: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params[UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_PLAN];
      this.codigoNivelRiesgo = params[UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN_CODIGO_NIVEL_RIESGO];

      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true })
      ]).subscribe(([
        _fondos,
        _nivelRiesgos
      ]) => {
        this.fondos = _fondos.content;
        this.nivelesRiesgos = _nivelRiesgos._embedded.mimNivelRiesgo;
        if (this.codigoPlan && this.codigoNivelRiesgo) {
          this.backService.nivelRiesgoPlan.getNivelRiesgoPlan(this.codigoPlan, this.codigoNivelRiesgo)
            .subscribe((resp: any) => {
              this.nivelRiesgoPlan = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this._changeFondo(resp.mimPlan.mimFondo.codigo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });

    });
  }

  _setRowInactivo(row: any) {
    if (!this.fondoSelected(row.mimPlan.mimFondo.codigo)) {
      this.fondos.push(row.mimPlan.mimFondo);
    }

    if (!this.nivelRiesgoSelected(row.mimPlanNivelRiesgoPK.codigoNivelRiesgo)) {
      this.nivelesRiesgos.push(row.mimNivelRiesgo);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimPlan.mimFondo.codigo) : null, [Validators.required]),
        plan: new FormControl(param ? this.planSelected(param.mimPlanNivelRiesgoPK.codigoPlan) : null, [Validators.required]),
        nivelRiesgo: new FormControl(param ? this.nivelRiesgoSelected(param.mimPlanNivelRiesgoPK.codigoNivelRiesgo) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.fondo.disable();
      this.form.controls.plan.disable();
      this.form.controls.nivelRiesgo.disable();
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];

      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del plan
   * @param codigo Codigo del plan
   */
  planSelected(codigo: string) {
    return this.planes.find(x => x.codigo === codigo);
  }

  nivelRiesgoSelected(codigo: string) {
    return this.nivelesRiesgos.find(x => x.codigo === codigo);
  }


  /**
   * Autor: Cesar Millan
   * @param fechaIni Fecha de inicio
   * @param fechaFin Fecha final
   */
  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
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
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      'fechaInicio': DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      'fechaFin': DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      'estado': true,
      'mimPlan': {
        'codigo': form.plan.codigo
      },
      'mimNivelRiesgo': {
        'codigo': form.nivelRiesgo.codigo
      }
    };

    this.backService.nivelRiesgoPlan.postNivelRiesgoPlan(param).subscribe((resp: any) => {
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
   * Autor: Cesar Millan
   * Función: Modifica la información del fondo
   */
  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      'mimPlan': {
        'codigo': form.plan.codigo
      },
      'mimNivelRiesgo': {
        'codigo': form.nivelRiesgo.codigo
      },
      'fechaInicio': DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      'fechaFin': DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      'estado': this.nivelRiesgoPlan.estado
    };

    this.backService.nivelRiesgoPlan.putNivelRiesgoPlan(this.codigoPlan, this.codigoNivelRiesgo, param).subscribe((resp: any) => {
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
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_NIVEL_RIESGO_PLAN]);
  }

  _changeFondo(codigoFondo?: string) {
    const codigo = codigoFondo || this.form.value.fondo.codigo;
    this.backService.planes.getPlanes({
      'mimFondo.codigo': codigo,
      isPaged: false,
      'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO],
      sort: 'nombre,asc', size: 1000000
    }).subscribe((resp: any) => {
      this.planes = resp ? resp.content : [];
      if (!this._esCreacion) {
        if (!this.planSelected(this.nivelRiesgoPlan.mimPlanNivelRiesgoPK.codigoPlan)) {
          this.planes.push(this.nivelRiesgoPlan.mimPlan);
        }
        this._initForm(this.nivelRiesgoPlan);
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
