import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormValidate } from '@shared/util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { PlanMediosFacturacionService } from '../services/plan-medios-facturacion.service';
import { MediosFacturacionService } from '../../../../../../core/services/api-back.services/mimutualprotecciones/medios-facturacion.service';
import { DateUtil } from '@shared/util/date.util';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-medios-facturacion',
  templateUrl: './guardar-medios-facturacion.component.html',
})
export class GuardarMediosFacturacionComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoPlan: string;
  codigoMedioFacturacion: string;

  planMedioFacturacion: any;

  fondos: any[] = [];
  planes: any[] = [];
  mediosFacturacion: any[] = [];
  estadoFecha: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly mediosFacturacionService: MediosFacturacionService,
    private readonly planMediosFacturacionService: PlanMediosFacturacionService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params['codigoPlan'];
      this.codigoMedioFacturacion = params['codigoMedioFacturacion'];
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.mediosFacturacionService.listarMediosFacturacion({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
      ]).subscribe(([
        _fondos,
        _mediosFacturacion
      ]) => {
        this.fondos = _fondos.content;
        this.mediosFacturacion = _mediosFacturacion._embedded.mimMedioFacturacion;

        if (this.codigoPlan && this.codigoMedioFacturacion) {
          this.planMediosFacturacionService.obtenerPlanMedioFacturacion(this.codigoPlan, this.codigoMedioFacturacion)
            .subscribe((respuesta: any) => {
              this.planMedioFacturacion = respuesta;
              this._esCreacion = false;
              this._setRowInactivo(respuesta);
              this._initForm(this.planMedioFacturacion);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _setRowInactivo(resp: any) {
    if (!this.fondoSelected(resp.mimPlan.mimFondo.codigo)) {
      this.fondos.push(resp.mimPlan.mimFondo);
    }
    if (!this.medioFacturacionSelected(resp.mimMedioFacturacion.codigo)) {
      this.mediosFacturacion.push(resp.mimMedioFacturacion);
    }
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimPlan.mimFondo.codigo) : null, [Validators.required]),
        plan: new FormControl(param ? this.planSelected(param.mimPlan.codigo) : null, [Validators.required]),
        medioFacturacion: new FormControl(param ? this.medioFacturacionSelected(param.mimMedioFacturacion.codigo) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    this.onChanges(param);
    // Para forzar la carga del componente seleccionable de planes realizamos lo siguiente:
    this.form.controls.fondo.setValue(param ? this.fondoSelected(param.mimPlan.mimFondo.codigo) : null);
    if (param) {
      this.form.controls.fondo.markAsPristine({ onlySelf: true });
    }

    this.estadoFecha = param ? !param.estado : false;
    if (!this._esCreacion) {
      // El codigo cliente siempre debera estar deshabilitado.
      this.form.controls.fondo.disable();
      // El codigo cliente siempre debera estar deshabilitado.
      this.form.controls.plan.disable();
      // El codigo cliente siempre debera estar deshabilitado.
      this.form.controls.medioFacturacion.disable();

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];

    }

  }

  onChanges(param?: any) {
    this.form.controls.fondo.valueChanges.subscribe(fondo => {
      if (fondo) {
        this.backService.planes.getPlanes({
          'mimFondo.codigo': fondo.codigo, isPaged: false,
          'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO],
          sort: 'nombre,asc', size: 1000000
        }).subscribe((respuesta: any) => {
          this.planes = respuesta ? respuesta.content : [];
          if (!this._esCreacion && !this.planSelected(this.planMedioFacturacion.mimPlan.codigo)) {
            this.planes.push(this.planMedioFacturacion.mimPlan);
          }
          // Seleccionamos el plan.
          this.form.controls.plan.setValue(param ? this.planSelected(param.mimPlan.codigo) : null);

          if (param) {
            this.form.controls.plan.markAsPristine({ onlySelf: true });
          }
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
      }
    });
  }

  fondoSelected(codigo: string) {
    return this.fondos.find(fondo => fondo.codigo === codigo);
  }

  planSelected(codigo: string) {
    return this.planes.find(plan => plan.codigo === codigo);
  }

  medioFacturacionSelected(codigo: string) {
    return this.mediosFacturacion.find(medioFacturacion => medioFacturacion.codigo === codigo);
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
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
    const form: any = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      mimPlan: {
        codigo: form.plan.codigo
      },
      mimMedioFacturacion: {
        codigo: form.medioFacturacion.codigo
      },
      estado: true,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };

    this.planMediosFacturacionService.crearPlanMedioFacturacion(param).subscribe((respuesta: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irAListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');

    const param = {
      mimPlan: {
        codigo: form.plan.codigo
      },
      mimMedioFacturacion: {
        codigo: form.medioFacturacion.codigo
      },
      estado: this.planMedioFacturacion.estado,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };

    this.planMediosFacturacionService.actualizarPlanMedioFacturacion(this.codigoPlan, this.codigoMedioFacturacion, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irAListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irAListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_MEDIO_FACTURACION_PLAN]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
