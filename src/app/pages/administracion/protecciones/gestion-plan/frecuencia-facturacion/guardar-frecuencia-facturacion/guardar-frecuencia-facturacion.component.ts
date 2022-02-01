import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormValidate } from '@shared/util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { DateUtil } from '@shared/util/date.util';
import { FrecuenciaFacturacionPlanService } from '../services/frecuencia-facturacion-plan.service';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';
@Component({
  selector: 'app-guardar-frecuencia-facturacion',
  templateUrl: './guardar-frecuencia-facturacion.component.html',
})
export class GuardarFrecuenciaFacturacionComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoPlan: string;
  codigoFrecuenciaFacturacion: any;
  fondo: any;
  plan: any;
  frecuencia: any;
  frecuenciaFacturacionPlan: any;

  fondos: any[] = [];
  planes: any[] = [];
  frecuencias: any[] = [];
  frecuenciaFacturacionPlanes: any[] = [];
  estadoFecha: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router,
    private readonly frecuenciaFacturacionPlanService: FrecuenciaFacturacionPlanService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params.codigoPlan;
      this.codigoFrecuenciaFacturacion = params.codigoPeriodoFacturacion;

      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.frecuenciaFacturacion.getFrecuenciasFacturaciones({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 })
      ]).subscribe(([
        _fondos,
        _frecuencias
      ]) => {
        this.fondos = _fondos.content;
        this.frecuencias = _frecuencias._embedded.mimFrecuenciaFacturacion;
        if (this.codigoPlan && this.codigoFrecuenciaFacturacion) {
          this.frecuenciaFacturacionPlanService.getFrecuenciaFacturacion(this.codigoPlan, this.codigoFrecuenciaFacturacion)
            .subscribe((resp: any) => {
              this.frecuenciaFacturacionPlan = resp;
              this._esCreacion = false;
              this._setRowInactivo(resp);
              this._changeFondo(resp.mimPlan.mimFondo.codigo);
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

  _setRowInactivo(row: any) {
    if (!this.fondoSelected(row.mimPlan.mimFondo.codigo)) {
      this.fondos.push(row.mimPlan.mimFondo);
    }

    if (!this.frecuenciaSelected(row.mimPlanFrecuenciaFacturacionPK.codigoPeriodoFacturacion)) {
      this.frecuencias.push(row.mimFrecuenciaFacturacion);
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
        plan: new FormControl(param ? this.planSelected(param.mimPlanFrecuenciaFacturacionPK.codigoPlan) : null, [Validators.required]),
        frecuencia: new FormControl(param ? this.frecuenciaSelected(param.mimPlanFrecuenciaFacturacionPK.codigoPeriodoFacturacion) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.fondo.disable();
      this.form.controls.plan.disable();
      this.form.controls.frecuencia.disable();
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }
    }

    this.onChanges();
  }

  onChanges() {
    this.form.controls.fondo.valueChanges.subscribe(fondo => {
      if (fondo) {
        this._changeFondo(fondo.codigo);
      }
    });
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

  frecuenciaSelected(codigo: string) {
    return this.frecuencias.filter(x => x.codigo === codigo);
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
      'mimPlanFrecuenciaFacturacionPK':
      {
        'codigoPlan': form.plan.codigo
      },
      'listPeriodoFacturacionSave': form.frecuencia.map(r => ({ 'codigoPeriodoFacturacion': r.codigo })),
      'fechaInicio': DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      'fechaFin': DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      'estado': true,
    };

    this.frecuenciaFacturacionPlanService.postFrecuenciaFacturacion(param).subscribe((resp: any) => {
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
      'mimPlanFrecuenciaFacturacionPK':
      {
        'codigoPlan': this.codigoPlan,
        'codigoPeriodoFacturacion': this.codigoFrecuenciaFacturacion
      },
      'fechaInicio': DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      'fechaFin': DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      'estado': this.frecuenciaFacturacionPlan.estado,
    };

    this.frecuenciaFacturacionPlanService.putFrecuenciaFacturacion(this.codigoPlan, this.codigoFrecuenciaFacturacion, param).subscribe((resp: any) => {
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
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_FRECUENCIA_FACTURACION_PLAN
    ]);
  }

  _changeFondo(codigoFondo?: string) {
    const codigo = codigoFondo || this.form.value.fondo.codigo;
    this.backService.planes.getPlanes({
      'mimFondo.codigo': codigo,
      'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO],
      sort: 'nombre,asc', isPaged: true, size: 1000000
    }).subscribe((resp: any) => {
      this.planes = resp ? resp.content : [];
      if (!this._esCreacion) {
        if (!this.planSelected(this.frecuenciaFacturacionPlan.mimPlanFrecuenciaFacturacionPK.codigoPlan)) {
          this.planes.push(this.frecuenciaFacturacionPlan.mimPlan);
        }
        this._initForm(this.frecuenciaFacturacionPlan);
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
