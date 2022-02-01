import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimPlanCoberturaEdad } from '../../../model/mim-plan-cobertura-edad.model';
import { IMimPlanCobertura } from '../../../model/mim-plan-cobertura.model';
import { PostDatosPrincipalesAction } from '../../../plan-cobertura.actions';
import { PlanCoberturaConfig } from '../../plan-cobertura.config';
import { DatosPrincipalesConfig } from './datos-principales.config';

@Component({
  selector: 'app-datos-principales',
  templateUrl: './datos-principales.component.html',
  styleUrls: ['./datos-principales.component.css'],
})
export class DatosPrincipalesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {
  /** Id de la seccion */
  id = 'datosBasicos';
  codigoPlanCobertura: string;
  form: FormGroup;
  isForm: Promise<any>;

  dropdown: boolean;

  plan: any;
  coberturas: any[];
  planesCoberturas: any[];
  origenes: any[];
  estados: any[];
  tiposFecha: any[];
  estadoSinFiltro: any[];
  meses: any[];
  tipoIncrementos: any[];
  mostrarPeriodoIncrementoInicio: boolean = false;
  mostrarPeriodoIncrementoFin: boolean = false;

  _esCreacion: boolean;
  _subs: Subscription[] = [];
  planCobertura: GuardarPlanCobertura;
  codigoFondo: number;
  fondo: any;
  codigoPlan: string;

  proteccionesEventos: any[] = [];

  planCoberturaConfig: PlanCoberturaConfig = new PlanCoberturaConfig();
  configuracion: DatosPrincipalesConfig = new DatosPrincipalesConfig();

  mostrarGridEdades: boolean;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura; // codigo;
      this.codigoPlan = params.codigoPlan; // plan
      this.mostrarGridEdades = false;

      forkJoin([
        this.backService.planes.getPlan(this.codigoPlan),
        this.backService.estadoPlanCobertura.obtenerEstadosPlanCobertura({
          estado: true, codigo: [MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO]
        }),
        this.backService.origenCoberturas.obtenerOrigenCoberturas({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000 }),
        this.backService.planCobertura.getPlanesCoberturas({
          'mimCobertura.mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
        }),
        this.backService.tipoFecha.getTiposFecha({ estado: true }),
        this.backService.tipoIncremento.getTiposIncremento({ estado: true }),
        this.backService.mes.getMesesAnio({ estado: true })
      ]).subscribe(([
        _plan,
        _estadosCoberturas,
        _origenCoberturas,
        _planesCoberturas,
        _tiposFecha,
        _tipoIncremento,
        _meses
      ]) => {
        this.plan = _plan;
        this.fondo = _plan.mimFondo;
        this.codigoFondo = this.fondo.codigo;
        this._getCobertura(this.fondo.codigo);
        this.estados = _estadosCoberturas._embedded.mimEstadoPlanCobertura;
        this.tiposFecha = _tiposFecha._embedded.mimTipoFecha;
        this.tiposFecha.unshift({ codigo: null, nombre: 'Seleccionar' });
        this.tipoIncrementos = _tipoIncremento._embedded.mimTipoIncremento;
        this.meses = _meses._embedded.mimMesAnio;

        this.origenes = _origenCoberturas.content;
        this.planesCoberturas = _planesCoberturas.content;

        if (!this.codigoPlanCobertura) {
          this._esCreacion = true;
          // Por defecto este componente siempre iniciara abierto si es creacion.
          this.dropdown = true;
          this.initForm();
        }
      });

    }));

    // Nos subscribimos a los cambios al Redux. Si se trata de una actualizacion,
    // al obtener los parametros de URL e ir back se debio haber publicado en Redux la informacion de plan/cobertura.
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }

        this.planCobertura = ui;
        // Si se tiene una respuesta el plan/cobertura fue creado y se tratariaa de una edicion.
        this._esCreacion = false;

        // Inicializamos el formulario con lo que venga de Redux.
        this.initForm(this.planCobertura.planCobertura);
      }));
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  get arrayEdades() {
    return this.form.controls.arrayEdades as FormArray;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        cobertura: new FormControl(param ? this.obtenerCobertura(param.mimCobertura.codigo) : null, [Validators.required]),
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(255)]),
        nombreCorto: new FormControl(param ? param.nombreCorto : null, [Validators.required, Validators.maxLength(15)]),
        origen: new FormControl(param && param.mimOrigenPlanCoberturaList ? this.obtenerOrigen(param.mimOrigenPlanCoberturaList) : null, [Validators.required]),
        coberturaBasica: new FormControl(param ? param.coberturaBasica : false, [Validators.required]),
        fechaPerseveracia: new FormControl(param && param.mimTipoFecha ? this.obtenerTipoFecha(param.mimTipoFecha.codigo) : null),
        planCoberturaRequerida: new FormControl(param ? param.planCoberturaRequerido : false, [Validators.required]),
        tipoIncremento: new FormControl(param ? this.obtenerTipoIncremento(param.mimTipoIncremento ? param.mimTipoIncremento.codigo : null) : null),
        periodoInicioIncremento: new FormControl(param ? this.obtenerPeriodoIncremento(param.mimPeriodoInicioIncrementoAnual ? param.mimPeriodoInicioIncrementoAnual.codigo : null) : null),
        periodoFinIncremento: new FormControl(param ? this.obtenerPeriodoIncremento(param.mimPeriodoFinIncrementoAnual ? param.mimPeriodoFinIncrementoAnual.codigo : null) : null),
        descripcionCobertura: new FormControl(param && param.descripcionCobertura ? param.descripcionCobertura : null, Validators.maxLength(2000)),
        codigoEdad: new FormControl(null),
        edadMinima: new FormControl(null, [Validators.required, Validators.min(18), Validators.max(100)]),
        edadMaxima: new FormControl(null, [Validators.required, Validators.min(18), Validators.max(100)]),
        edadIndemnizacion: new FormControl(null, [Validators.min(18), Validators.max(100)]),
        edadMaximaPermanencia: new FormControl(null, [Validators.min(18), Validators.max(150)]),
        plazo: new FormControl(null, [Validators.min(1), Validators.max(10)]),
        fondoGarantia: new FormControl(false, [Validators.required]),
        renovacion: new FormControl(false, [Validators.required]),
        arrayEdades: this.formBuilder.array([]),
        estado: new FormControl(param ? this.obtenerEstado(param.mimEstadoPlanCobertura.codigo) : null, [Validators.required]),
        deducibles: new FormControl(param ? param.deducibles : true),
        periodosCarencia: new FormControl(param ? param.periodosCarencia : true),
        exclusiones: new FormControl(param ? param.exclusionesPlanCobertura : true),
        enfermedadesGraves: new FormControl(param ? param.enfermedadesGraves : true),
        conceptoFacturacion: new FormControl(param ? param.conceptoFacturacion : true),
        desmembracionAccidente: new FormControl(param ? param.desmembracionAccidente : true),
        condicionVenta: new FormControl(param ? param.condicionVenta : true),
        coberturasSubsistentes: new FormControl(param ? param.coberturasSubsistentes : true),
        valorRescate: new FormControl(param ? param.valorRescate : true),
        valorAsegurado: new FormControl(param ? param.valorAsegurado : true),
        valorCuota: new FormControl(param ? param.valorCuota : true),
        limitacionesCobertura: new FormControl(param ? param.limitacionCobertura : true),
        beneficioPorPreexistencia: new FormControl(param ? param.beneficioPorPreexistencia : true),
        reconocimientoPermanencia: new FormControl(param ? param.reconocimientoPermanencia : true),
        reglasExcepciones: new FormControl(param ? param.reglasExcepciones : true)
      }, {
        validators: [
          minMaxValidator('edadMinima', 'edadMaxima'),
          minMaxValidator('edadMaxima', 'edadMaximaPermanencia', 'rangePermanencia')
        ]
      })
    );

    if (!this._esCreacion) {
      this.form.controls.cobertura.disable();
      this.form.controls.estado.disable();
      this.form.controls.coberturaBasica.disable();
      if (param.mimPlan.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO) {
        this._bloquearObligatoriedad();
      }
      if (param.mimPlan.mimFaseFlujo === undefined && param.mimEstadoPlanCobertura === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.PROCESO) {
        this._desbloquearObligatoriedad();
      }
      if (param.mimTipoIncremento.codigo === MIM_PARAMETROS.MIM_TIPO_INCREMENTO.CERRADO) {
        this.mostrarPeriodoIncrementoInicio = true;
        this.mostrarPeriodoIncrementoFin = true;
      } else {
        this.mostrarPeriodoIncrementoInicio = false;
        this.mostrarPeriodoIncrementoFin = false;
      }
    }

    if (this.planCobertura && this.planCobertura.planCobertura) {
      this.form.controls.cobertura.markAsPristine({ onlySelf: true });

      if (this.planCobertura.planCobertura.mimCobertura.asistencia) {
        this.form.controls.coberturaBasica.disable();
      }

      if (param.planCoberturaRequerido) {
        this.mostrarGridEdades = true;
      }
    }

    this.form.controls.deducibles.markAsPristine({ onlySelf: true });
    this.form.controls.periodosCarencia.markAsPristine({ onlySelf: true });
    this.form.controls.exclusiones.markAsPristine({ onlySelf: true });
    this.form.controls.enfermedadesGraves.markAsPristine({ onlySelf: true });
    this.form.controls.conceptoFacturacion.markAsPristine({ onlySelf: true });
    this.form.controls.desmembracionAccidente.markAsPristine({ onlySelf: true });
    this.form.controls.condicionVenta.markAsPristine({ onlySelf: true });
    this.form.controls.coberturasSubsistentes.markAsPristine({ onlySelf: true });
    this.form.controls.valorRescate.markAsPristine({ onlySelf: true });
    this.form.controls.valorAsegurado.markAsPristine({ onlySelf: true });
    this.form.controls.valorCuota.markAsPristine({ onlySelf: true });
    this.form.controls.limitacionesCobertura.markAsPristine({ onlySelf: true });
    this.form.controls.beneficioPorPreexistencia.markAsPristine({ onlySelf: true });
    this.form.controls.reconocimientoPermanencia.markAsPristine({ onlySelf: true });
    this.form.controls.reglasExcepciones.markAsPristine({ onlySelf: true });

    this.changeDeducible();
    this.changePeriodosCarencia();
    this.changeExcluciones();
    this.changeEnfermedadesGraves();
    this.changeConceptoFacturacion();
    this.changeDesmembracionPorAccidente();
    this.changeCondicionVenta();
    this.changeCoberturaSubsistente();
    this.changeValorRescate();
    this.changeValorAsegurado();
    this.changeValorCuota();
    this.changeLimitacionesCobertura();
    this.changeBeneficioPorPreexistencia();
    this.changeReconocimientoPermanencia();
    this.changeReglasExcepciones();
    this.changeCoberturaAsistencia();
    this.changePlanCoberturaRequerida();
    this.changeTipoIncremento()

    // Se carga los controles de edades
    if (param && param.mimPlanCoberturaEdadList) {
      if (this.mostrarGridEdades) {
        for (const edad of param.mimPlanCoberturaEdadList) {
          this.arrayEdades.push(this.crearFilaEdad(edad));
        }
        this.form.controls.edadMinima.setErrors(null);
        this.form.controls.edadMaxima.setErrors(null);
        this.form.controls.edadMinima.setValue(18);
        this.form.controls.edadMaxima.setValue(100);

      } else {
        this.arrayEdades.clear();
        const paramEdad = param.mimPlanCoberturaEdadList[0];
        this.form.controls.codigoEdad.setValue(paramEdad.codigo);
        this.form.controls.edadMinima.setValue(paramEdad.edadMinIngreso);
        this.form.controls.edadMaxima.setValue(paramEdad.edadMaxIngreso);
        this.form.controls.edadIndemnizacion.setValue(paramEdad.edadIndemnizacion);
        this.form.controls.edadMaximaPermanencia.setValue(paramEdad.edadMaxPermanencia);
        this.form.controls.plazo.setValue(paramEdad.plazo);
        this.form.controls.fondoGarantia.setValue(paramEdad.fondoGarantia);
        this.form.controls.renovacion.setValue(paramEdad.renovacion);
      }
    }
  }

  private crearFilaEdad(paramEdad?: any): FormGroup {
    return this.formBuilder.group({
      codigoEdad: new FormControl(paramEdad && paramEdad.codigo ? paramEdad.codigo : null),
      planCoberturaEdad: new FormControl(paramEdad && paramEdad.mimPlanCoberturaRelacionado ? this.obtenerPlanCobertura(paramEdad.mimPlanCoberturaRelacionado.codigo) : null, [Validators.required]),
      edadMinima: new FormControl(paramEdad ? paramEdad.edadMinIngreso : null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100)]),
      edadMaxima: new FormControl(paramEdad ? paramEdad.edadMaxIngreso : null, [
        Validators.required,
        Validators.min(18),
        Validators.max(100)]),
      edadIndemnizacion: new FormControl(paramEdad ? paramEdad.edadIndemnizacion : null, [
        Validators.min(18),
        Validators.max(100)]),
      edadMaximaPermanencia: new FormControl(paramEdad ? paramEdad.edadMaxPermanencia : null, [
        Validators.min(18),
        Validators.max(150)]),
      plazo: new FormControl(paramEdad ? paramEdad.plazo : null, [
        Validators.min(1),
        Validators.max(100)]),
      fondoGarantia: new FormControl(paramEdad ? paramEdad.fondoGarantia : false, [Validators.required]),
      renovacion: new FormControl(paramEdad ? paramEdad.renovacion : false, [Validators.required]),
    }, {
      validators: [
        minMaxValidator('edadMinima', 'edadMaxima'),
        minMaxValidator('edadMaxima', 'edadMaximaPermanencia', 'rangePermanencia')
      ]
    });
  }

  changeCoberturaAsistencia() {
    this.form.controls.cobertura.valueChanges.subscribe(item => {
      if (item.asistencia) {
        this.form.controls.coberturaBasica.disable();
      } else {
        this.form.controls.coberturaBasica.enable();
      }
    });
  }

  changeTipoIncremento() {
    this.form.controls.tipoIncremento.valueChanges.subscribe(tipoInc => {
      if (tipoInc.codigo === MIM_PARAMETROS.MIM_TIPO_INCREMENTO.CERRADO) {
        this.mostrarPeriodoIncrementoInicio = true;
        this.mostrarPeriodoIncrementoFin = true;
        this.form.controls.periodoInicioIncremento.setValidators([Validators.required]);
        this.form.controls.periodoFinIncremento.setValidators([Validators.required]);
      } else {
        this.mostrarPeriodoIncrementoInicio = false;
        this.mostrarPeriodoIncrementoFin = false;

        this.form.controls.periodoInicioIncremento.setValidators(null);
        this.form.controls.periodoInicioIncremento.updateValueAndValidity();

        this.form.controls.periodoFinIncremento.setValidators(null);
        this.form.controls.periodoFinIncremento.updateValueAndValidity();
      }

    });
  }

  changePlanCoberturaRequerida() {
    this.form.controls.planCoberturaRequerida.valueChanges.subscribe(requerida => {
      if (requerida) {
        this.mostrarGridEdades = true;
        this.arrayEdades.clear();
        if (!this.arrayEdades || this.arrayEdades.length === 0) {
          this.addNewRow();
        }

        this.form.controls.edadMinima.setErrors(null);
        this.form.controls.edadMaxima.setErrors(null);

      } else {
        this.arrayEdades.clear();

        this.mostrarGridEdades = false;
        this.form.controls.edadMinima.setValue(null);
        this.form.controls.edadMinima.setErrors({ 'required': true });
        this.form.controls.edadMaxima.setValue(null);
        this.form.controls.edadMinima.setErrors({ 'required': true });
        this.form.controls.edadIndemnizacion.setValue(null);
        this.form.controls.edadMaximaPermanencia.setValue(null);
        this.form.controls.plazo.setValue(null);
        this.form.controls.fondoGarantia.setValue(false);
        this.form.controls.renovacion.setValue(false);

      }
    });
  }


  _onSalir() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.codigoPlan]);
  }

  private obtenerCobertura(codigo: number) {
    return this.coberturas ? this.coberturas.find(cobertura => cobertura.codigo === codigo) : null;
  }

  private obtenerTipoIncremento(codigo: number) {
    return this.tipoIncrementos ? this.tipoIncrementos.find(inc => inc.codigo === codigo) : null;
  }

  private obtenerPeriodoIncremento(codigo: number) {
    return this.meses ? this.meses.find(mes => mes.codigo === codigo) : null;
  }

  private obtenerEstado(codigo: string) {
    return this.estados ? this.estados.find(estado => estado.codigo === codigo) : null;
  }

  private obtenerOrigen(items: any[]) {
    return this.origenes.filter(origen => items.find(item =>
      item.mimOrigenPlanCoberturaPK.codigoOrigenCobertura === origen.codigo));
  }

  private obtenerTipoFecha(codigo: number) {
    return this.tiposFecha ? this.tiposFecha.find(tipoFecha => tipoFecha.codigo === codigo) : null;
  }

  private obtenerPlanCobertura(codigo: any) {
    return this.planesCoberturas.find(planCobertura => planCobertura.codigo === codigo);
  }


  _toggle() {
    if (!this.hasChanges()) {
      this.dropdown = !this.dropdown;
    } else {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.dropdown = false;
          if (this._esCreacion) {
            this.initForm();
          } else {
            this.initForm(this.planCobertura.planCobertura);
          }
        }
      });
    }
  }

  _guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.mostrarGridEdades && (!this.arrayEdades || this.arrayEdades.length === 0)) {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.mensajeEdades').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  crearPlanCoberturaEdadList(): IMimPlanCoberturaEdad[] {

    let planCoberturaEdadList: IMimPlanCoberturaEdad[] = null;

    if (this.mostrarGridEdades) {
      if (this.arrayEdades && this.arrayEdades.length > 0) {

        // Se obtiene los valores del objeto edades
        planCoberturaEdadList = this.arrayEdades.controls.map(c => {
          return {
            codigo: c.value.codigoEdad,
            mimPlanCoberturaRelacionado: { codigo: c.value.planCoberturaEdad.codigo },
            edadMinIngreso: c.value.edadMinima,
            edadMaxIngreso: c.value.edadMaxima,
            edadIndemnizacion: c.value.edadIndemnizacion,
            edadMaxPermanencia: c.value.edadMaximaPermanencia,
            plazo: c.value.plazo,
            fondoGarantia: c.value.fondoGarantia,
            renovacion: c.value.renovacion
          } as IMimPlanCoberturaEdad;
        });
      }
    } else {

      const planCoberturaEdad = {
        codigo: this.form.controls.codigoEdad.value,
        edadMinIngreso: this.form.controls.edadMinima.value,
        edadMaxIngreso: this.form.controls.edadMaxima.value,
        edadIndemnizacion: this.form.controls.edadIndemnizacion.value,
        edadMaxPermanencia: this.form.controls.edadMaximaPermanencia.value,
        plazo: this.form.controls.plazo.value,
        fondoGarantia: this.form.controls.fondoGarantia.value,
        renovacion: this.form.controls.renovacion.value
      } as IMimPlanCoberturaEdad;

      planCoberturaEdadList = [planCoberturaEdad];
    }
    return planCoberturaEdadList;
  }

  _crear() {
    const form: any = this.form.value;
    const planCobertura = {
      mimPlan: { codigo: this.plan.codigo },
      mimCobertura: { codigo: form.cobertura.codigo },
      mimOrigenPlanCoberturaList: this.form.controls.origen.value.map(origen => {
        return { mimOrigenCobertura: { codigo: origen.codigo } };
      }),
      nombre: form.nombre,
      nombreCorto: form.nombreCorto,
      coberturaBasica: form.coberturaBasica ? form.coberturaBasica : false,
      mimTipoFecha: form.fechaPerseveracia ? { codigo: form.fechaPerseveracia.codigo } : null,
      planCoberturaRequerido: form.planCoberturaRequerida,
      mimTipoIncremento: { codigo: form.tipoIncremento.codigo },
      mimPeriodoInicioIncrementoAnual: form.periodoInicioIncremento ? { codigo: form.periodoInicioIncremento.codigo } : null,
      mimPeriodoFinIncrementoAnual: form.periodoFinIncremento ? { codigo: form.periodoFinIncremento.codigo } : null,
      descripcionCobertura: form.descripcionCobertura,
      mimEstadoPlanCobertura: { codigo: form.estado.codigo },
      deducibles: form.deducibles,
      periodosCarencia: form.periodosCarencia,
      exclusionesPlanCobertura: form.exclusiones,
      enfermedadesGraves: form.enfermedadesGraves,
      conceptoFacturacion: form.conceptoFacturacion,
      desmembracionAccidente: form.desmembracionAccidente,
      condicionVenta: form.condicionVenta,
      coberturasSubsistentes: form.coberturasSubsistentes,
      valorRescate: form.valorRescate,
      valorAsegurado: form.valorAsegurado,
      valorCuota: form.valorCuota,
      limitacionCobertura: form.limitacionesCobertura,
      beneficioPorPreexistencia: form.beneficioPorPreexistencia,
      reconocimientoPermanencia: form.reconocimientoPermanencia,
      reglasExcepciones: form.reglasExcepciones,
      mimPlanCoberturaEdadList: this.crearPlanCoberturaEdadList()
    } as IMimPlanCobertura;


    this.backService.planCobertura.postPlanCobertura(planCobertura).subscribe((respuesta: any) => {
      this.codigoPlanCobertura = respuesta.codigo;

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Cerramos la seccion
          this.dropdown = false;

          this._irEditar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }


  // Validacion para verificar que la conf de obligatoriedad no este comercializada
  async validaObligatoriedadPlan() {
    const _proteccionesEventos = await this.backService.proteccionesEventos.getProteccionesEventos({
      'codigoPlan': this.planCobertura.planCobertura.mimPlan.codigo,
      'codigoCobertura': this.planCobertura.planCobertura.mimCobertura.codigo,
      isPaged: true
    }).toPromise();
    this.proteccionesEventos = _proteccionesEventos.content;
    if (this.proteccionesEventos.length > 0) {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.proteccionesEventos').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });
    }
  }

  changeCoberturaSubsistente() {
    this.form.controls.coberturasSubsistentes.valueChanges.subscribe(coberturasSubsistente => {
      if (!coberturasSubsistente) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeDeducible() {
    this.form.controls.deducibles.valueChanges.subscribe(async deducible => {
      if (!deducible) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changePeriodosCarencia() {
    this.form.controls.periodosCarencia.valueChanges.subscribe(async periodos => {
      if (!periodos) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeExcluciones() {
    this.form.controls.exclusiones.valueChanges.subscribe(async exclusion => {
      if (!exclusion) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeValorRescate() {
    this.form.controls.valorRescate.valueChanges.subscribe(async valor => {
      if (!valor) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeValorAsegurado() {
    this.form.controls.valorAsegurado.valueChanges.subscribe(async valor => {
      if (!valor) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeBeneficioPorPreexistencia() {
    this.form.controls.beneficioPorPreexistencia.valueChanges.subscribe(async beneficio => {
      if (!beneficio) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeLimitacionesCobertura() {
    this.form.controls.limitacionesCobertura.valueChanges.subscribe(async limitacionesCobertur => {
      if (!limitacionesCobertur) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeEnfermedadesGraves() {
    this.form.controls.enfermedadesGraves.valueChanges.subscribe(async enfermedadGrave => {
      if (!enfermedadGrave) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeDesmembracionPorAccidente() {
    this.form.controls.desmembracionAccidente.valueChanges.subscribe(async desmembracionPorAccidente => {
      if (!desmembracionPorAccidente) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeCondicionVenta() {
    this.form.controls.condicionVenta.valueChanges.subscribe(async condicion => {
      if (!condicion) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeValorCuota() {
    this.form.controls.valorCuota.valueChanges.subscribe(async valor => {
      if (!valor) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeReconocimientoPermanencia() {
    this.form.controls.reconocimientoPermanencia.valueChanges.subscribe(async reconocimiento => {
      if (!reconocimiento) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeReglasExcepciones() {
    this.form.controls.reglasExcepciones.valueChanges.subscribe(async reglas => {
      if (!reglas) {
        this.validaObligatoriedadPlan();
      }
    });
  }
  changeConceptoFacturacion() {
    this.form.controls.conceptoFacturacion.valueChanges.subscribe(async concepto => {
      if (!concepto) {
        this.validaObligatoriedadPlan();
      }
    });
  }

  async _actualizar() {
    const form: any = this.form.value;
    this.planCobertura.planCobertura.mimOrigenPlanCoberturaList = this.form.controls.origen.value.map(origen => {
      return { mimOrigenCobertura: { codigo: origen.codigo } };
    });
    this.planCobertura.planCobertura.nombre = form.nombre;
    this.planCobertura.planCobertura.nombreCorto = form.nombreCorto;
    this.planCobertura.planCobertura.mimTipoFecha = form.fechaPerseveracia ? { codigo: form.fechaPerseveracia.codigo } : null;
    this.planCobertura.planCobertura.planCoberturaRequerido = form.planCoberturaRequerida;
    this.planCobertura.planCobertura.mimTipoIncremento = form.tipoIncremento ? { codigo: form.tipoIncremento.codigo } : null;
    this.planCobertura.planCobertura.mimPeriodoInicioIncrementoAnual = form.tipoIncremento.codigo === MIM_PARAMETROS.MIM_TIPO_INCREMENTO.ACTIVO ? null : form.periodoInicioIncremento ? { codigo: form.periodoInicioIncremento.codigo } : null;
    this.planCobertura.planCobertura.mimPeriodoFinIncrementoAnual = form.tipoIncremento.codigo === MIM_PARAMETROS.MIM_TIPO_INCREMENTO.ACTIVO ? null : form.periodoFinIncremento ? { codigo: form.periodoFinIncremento.codigo } : null;
    this.planCobertura.planCobertura.descripcionCobertura = form.descripcionCobertura;
    this.planCobertura.planCobertura.mimEstadoPlanCobertura = form.estado ? { codigo: form.estado.codigo } : this.planCobertura.planCobertura.mimEstadoPlanCobertura;
    this.planCobertura.planCobertura.deducibles = form.deducibles;
    this.planCobertura.planCobertura.periodosCarencia = form.periodosCarencia;
    this.planCobertura.planCobertura.exclusionesPlanCobertura = form.exclusiones;
    this.planCobertura.planCobertura.enfermedadesGraves = form.enfermedadesGraves;
    this.planCobertura.planCobertura.conceptoFacturacion = form.conceptoFacturacion;
    this.planCobertura.planCobertura.desmembracionAccidente = form.desmembracionAccidente;
    this.planCobertura.planCobertura.condicionVenta = form.condicionVenta;
    this.planCobertura.planCobertura.coberturasSubsistentes = form.coberturasSubsistentes;
    this.planCobertura.planCobertura.valorRescate = form.valorRescate;
    this.planCobertura.planCobertura.valorAsegurado = form.valorAsegurado;
    this.planCobertura.planCobertura.valorCuota = form.valorCuota;
    this.planCobertura.planCobertura.limitacionCobertura = form.limitacionesCobertura;
    this.planCobertura.planCobertura.beneficioPorPreexistencia = form.beneficioPorPreexistencia;
    this.planCobertura.planCobertura.reconocimientoPermanencia = form.reconocimientoPermanencia;
    this.planCobertura.planCobertura.reglasExcepciones = form.reglasExcepciones;
    this.planCobertura.planCobertura.mimPlanCoberturaEdadList = this.crearPlanCoberturaEdadList();

    this.backService.planCobertura.putPlanCobertura(this.planCobertura.planCobertura.codigo, this.planCobertura.planCobertura).subscribe((respuesta: any) => {
      this.codigoPlanCobertura = respuesta.codigo;

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Cerramos la seccion
          this.dropdown = false;

          this._obtener(this.codigoPlanCobertura);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _obtener(codigo: string) {
    this.backService.planCobertura.getPlanCobertura(codigo).subscribe((respuesta: any) => {
      // Solo y unicamente publicamos al Redux, NO inicializamos el formulario aqui.
      // Eso lo realiza el observador de cambios en la p;íla de Redux.
      this.codigoFondo = respuesta.mimPlan.mimFondo.codigo;
      this._setRowInactivo(respuesta);
      const esAsistencia = respuesta.mimCobertura && respuesta.mimCobertura.asistencia;
      this.store.dispatch(new PostDatosPrincipalesAction(respuesta,
        esAsistencia ?
          this.planCoberturaConfig.planCoberturaAsistenciaConfig :
          this.planCoberturaConfig.planCoberturaConfig, this.id, Estado.Guardado));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }


  _setRowInactivo(row: any) {
    if (!this._esCreacion && !this.obtenerCobertura(row.mimCobertura.codigo)) {
      this.coberturas.push(row.mimCobertura);
    }

    if (!this._esCreacion && !this.obtenerEstado(row.mimEstadoPlanCobertura.codigo)) {
      this.estados.push(row.mimEstadoPlanCobertura);
    }

    row.mimOrigenPlanCoberturaList.forEach((item) => {
      if (item.mimOrigenCobertura && !item.mimOrigenCobertura.estado) {
        this.origenes.push(item.mimOrigenCobertura);
      }
    });

  }

  async _getCobertura(codigoFondo: string) {
    this.backService.cobertura.obtenerCoberturas({
      'mimFondo.codigo': codigoFondo,
      'mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO
    }).subscribe(item => {
      this.coberturas = item.content;

      if (this.codigoPlanCobertura) {
        this._obtener(this.codigoPlanCobertura);
      }

      if (this.planCobertura && this.planCobertura.planCobertura) {
        this.form.controls.cobertura.setValue(this.obtenerCobertura(this.planCobertura.planCobertura.mimCobertura.codigo));
        this.form.controls.cobertura.markAsPristine({ onlySelf: true });
      }
    });
  }

  _bloquearObligatoriedad() {
    this.form.controls.deducibles.disable();
    this.form.controls.periodosCarencia.disable();
    this.form.controls.exclusiones.disable();
    this.form.controls.enfermedadesGraves.disable();
    this.form.controls.conceptoFacturacion.disable();
    this.form.controls.desmembracionAccidente.disable();
    this.form.controls.condicionVenta.disable();
    this.form.controls.coberturasSubsistentes.disable();
    this.form.controls.valorRescate.disable();
    this.form.controls.valorAsegurado.disable();
    this.form.controls.valorCuota.disable();
    this.form.controls.limitacionesCobertura.disable();
    this.form.controls.beneficioPorPreexistencia.disable();
    this.form.controls.reconocimientoPermanencia.disable();
    this.form.controls.reglasExcepciones.disable();
  }

  _desbloquearObligatoriedad() {
    this.form.controls.deducibles.enable();
    this.form.controls.periodosCarencia.enable();
    this.form.controls.exclusiones.enable();
    this.form.controls.enfermedadesGraves.enable();
    this.form.controls.conceptoFacturacion.enable();
    this.form.controls.desmembracionAccidente.enable();
    this.form.controls.condicionVenta.enable();
    this.form.controls.coberturasSubsistentes.enable();
    this.form.controls.valorRescate.enable();
    this.form.controls.valorAsegurado.enable();
    this.form.controls.valorCuota.enable();
    this.form.controls.limitacionesCobertura.enable();
    this.form.controls.beneficioPorPreexistencia.enable();
    this.form.controls.reconocimientoPermanencia.enable();
    this.form.controls.reglasExcepciones.enable();
  }


  _irEditar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.codigoPlan,
      UrlRoute.ADMINISTRACION_PROTECCIONES_COBERTURA,
      this.codigoPlanCobertura]);
  }

  onDeleteRow(index: number) {
    this.arrayEdades.removeAt(index);
  }

  addNewRow(): void {
    if (this.arrayEdades.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    this.arrayEdades.push(this.crearFilaEdad());
  }

  getControls(index: number) {
    return this.arrayEdades.controls[index]['controls'];
  }


}
