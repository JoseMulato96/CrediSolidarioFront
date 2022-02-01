import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidate } from '@shared/util';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { minMaxEqualValidator, minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-control-area-tecnica',
  templateUrl: './guardar-control-area-tecnica.component.html',
})
export class GuardarControlAreaTecnicaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  patterns = masksPatterns;
  validateForm: any;
  isPristine: any;

  fondos: any[];
  planes: any[];
  canales: any[];
  tiposMovimientos: any[];
  tiposMovimientosSinFiltro: any[];
  nivelRiesgos: any[];


  conceptoFacturacionItem: any[] = [];

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
      this.codigo = params.codigo;
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.planes.getPlanes({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.canal.getCanalesVentas({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.tiposMovimientos.getTiposMovimientos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true })
      ]).subscribe(([
        _fondos,
        _planes,
        _canales,
        _tipoMovimientos,
        _nivelRiesgos
      ]) => {
        this.fondos = _fondos.content;
        this.planes = _planes.content;
        this.canales = _canales._embedded.mimCanal;
        this.tiposMovimientosSinFiltro = _tipoMovimientos._embedded.mimTipoMovimiento;
        this.tiposMovimientos = this.tiposMovimientosSinFiltro.filter(tipoMovimiento => tipoMovimiento.codigo !== MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.COTIZACION);
        this.nivelRiesgos = _nivelRiesgos._embedded.mimNivelRiesgo;

        if (this.codigo) {
          this.backService.controlAreaTecnica.getControlAreaTecnica(this.codigo)
            .subscribe((resp: any) => {
              this.conceptoFacturacionItem = resp;
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
        fondo: new FormControl(param ? this.obtenerFondos(param.mimFondo.codigo) : null, [Validators.required]),
        plan: new FormControl(param ? this.obtenerPlanes(param.mimPlan.codigo) : null, [Validators.required]),
        canal: new FormControl(param ? this.obtenerCanales(param.mimCanal.codigo) : null, [Validators.required]),
        tipoMovimiento: new FormControl(param ? this.obtenerTipoMovimientos(param.mimTipoMovimiento.codigo) : null, [Validators.required]),
        aplicaControlAreaTecnica: new FormControl(param ? param.aplicaControlAreaTecnica : false, [Validators.required]),
        nivelRiesgo: new FormControl(param ? this.obtenerNivelRiesgos(param.mimNivelRiesgo.codigo) : null, [Validators.required]),
        valorMinimoProteccion: new FormControl(param ? param.valorMinimoProteccion : null, [Validators.required]),
        valorMaximoProteccion: new FormControl(param ? param.valorMaximoProteccion : null, [Validators.required]),
        edadMinima: new FormControl(param ? param.edadMinima : null, [Validators.required, Validators.min(18), Validators.max(100)]),
        edadMaxima: new FormControl(param ? param.edadMaxima : null, [Validators.required, Validators.min(18), Validators.max(100)]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),

      }, { validators: [
        minMaxEqualValidator('valorMinimoProteccion', 'valorMaximoProteccion', 'rangeNoIguales'),
        minMaxValidator('edadMinima', 'edadMaxima'),
        minMaxValidator('valorMinimoProteccion', 'valorMaximoProteccion')
      ] }));


      if (this._esCreacion) {
        this.form.controls.vigente.setValue(true);
        this.form.controls.vigente.disable();
      }
      if (!this._esCreacion) {
        this.form.controls.fondo.disable();
        this.form.controls.plan.disable();
        this.form.controls.canal.disable();
        this.form.controls.tipoMovimiento.disable();
        this.form.controls.nivelRiesgo.disable();
      }
  }

  private obtenerFondos(codigo: any) {
    return this.fondos ? this.fondos.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerPlanes(codigo: any) {
    return this.planes ? this.planes.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerCanales(codigo: any) {
    return this.canales ? this.canales.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerTipoMovimientos(codigo: any) {
    return this.tiposMovimientos ? this.tiposMovimientos.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerNivelRiesgos(codigo: any) {
    return this.nivelRiesgos ? this.nivelRiesgos.find(resp => resp.codigo === codigo) : null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  /**
   * Autor: Bayron Andres
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
    const form: any = this.form.value;
    const param = {
      mimFondo: {codigo: form.fondo.codigo},
      mimPlan: {codigo: form.plan.codigo},
      mimCanal: {codigo: form.canal.codigo},
      mimTipoMovimiento: {codigo: form.tipoMovimiento.codigo},
      aplicaControlAreaTecnica: form.aplicaControlAreaTecnica,
      mimNivelRiesgo: {codigo: form.nivelRiesgo.codigo},
      valorMinimoProteccion: form.valorMinimoProteccion,
      valorMaximoProteccion: form.valorMaximoProteccion,
      edadMinima: form.edadMinima,
      edadMaxima: form.edadMaxima,
      estado: true,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.controlAreaTecnica.postControlAreaTecnica(param).subscribe((resp: any) => {
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
    const param = {
      codigo: this.codigo,
      mimFondo: {codigo: this.form.controls.fondo.value.codigo},
      mimPlan: {codigo: this.form.controls.plan.value.codigo},
      mimCanal: {codigo: this.form.controls.canal.value.codigo},
      mimTipoMovimiento: {codigo: this.form.controls.tipoMovimiento.value.codigo},
      aplicaControlAreaTecnica: form.aplicaControlAreaTecnica,
      mimNivelRiesgo: {codigo: this.form.controls.nivelRiesgo.value.codigo},
      valorMinimoProteccion: form.valorMinimoProteccion,
      valorMaximoProteccion: form.valorMaximoProteccion,
      edadMinima: form.edadMinima,
      edadMaxima: form.edadMaxima,
      estado: form.vigente,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };
    this.backService.controlAreaTecnica.putControlAreaTecnica(this.codigo, param).subscribe((resp: any) => {
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
   * Autor: Bayron Andres Perez M
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CONTROL_AREA_TECNICA]);
   }



  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }



}
