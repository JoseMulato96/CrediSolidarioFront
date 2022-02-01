import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { GENERALES } from '@shared/static/constantes/constantes';
import { numberMaskConfigPlanes } from '@shared/static/constantes/currency-mask';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Subscription } from 'rxjs/internal/Subscription';
import { IMimPlanObligatorio } from '../../../plan-cobertura/model/mim-plan-obligatorio.model';

@Component({
  selector: 'app-guardar-planes',
  templateUrl: './guardar-planes.component.html',
  styleUrls: ['./guardar-planes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GuardarPlanesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoPlan: any;
  plan: any;

  // clientes: any[];
  fondos: any[];
  tipoPlanes: any[];
  estadosPlanes: any[];
  estadoFecha: boolean;

  tipoCotizaciones: any[];
  tipoCuotasGlobal: any[];
  tipoMovimientos: any[];
  parentescos: any[];

  solicitud: string;
  idProceso: string;
  idTarea: string;
  showForm: boolean;
  showControlsAprobacion: boolean;
  observaciones: any;
  mostrarCondiciones = false;
  mostrarParentescos = false;
  tipoPlanDefeto = false;
  valorDefectoTPlan: any = null;
  optionsMask: any = numberMaskConfigPlanes;

  public listCondicionesTipo: Array<any> = [];

  public listPlanes: Array<any> = [];

  public listEstados: Array<any> = [];

  controlAutomaticoPerseverante = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.tipoCotizaciones = [];
    this.tipoCuotasGlobal = [];
    this.parentescos = [];
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params['codigoPlan'];
      this.solicitud = params.solicitud || null;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      this.showControlsAprobacion = this.idTarea !== null ? true : false;

      let objDatos = {
        _tipoPlanes: this.backService.tipoPlanes.getTipoPlanes({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        _fondos: this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        _estadosPlanes: this.backService.estadoPlan.getEstadosPlanes({
          estado: true, codigo: [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO,
          MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO], sort: 'nombre,asc', isPaged: true, size: 1000000
        }),
        _tipoCotizacion: this.backService.tipoCotizacion.getTipoCotizacion({ estado: true }),
        _tipoCuotasGlobal: this.backService.tipoCuotaTotalService.getTipoCuotaTotal({ estado: true }),
        _parentescos: this.backService.parentescos.getParentesco({ estado: true }),
        _tipoMovimientos: this.backService.tiposMovimientos.getTiposMovimientos({ estado: true }),
        _mimPlanes: this.backService.planes.getPlanes({ 'mimEstadoPlan.codigo': GENERALES.MIM_ESTADO_PLAN.DISPONIBLE }),
        _mimCondcionesTipo: this.backService.condicionesTipo.getCotizacionesTipo({ 'estado': true })
      } as any;

      if (this.idProceso) {
        objDatos = {
          ...objDatos,
          _observaciones: this.backService.proceso.getObservacionesByIdProceso(this.idProceso)
        };
      }

      if (this.idTarea) {
        objDatos = {
          ...objDatos,
          _esDirectorTecnico: this.backService.tarea.obtenerTarea(this.idTarea)
        };
      }

      forkJoin(objDatos).subscribe((items: any) => {
        this.estadosPlanes = items._estadosPlanes._embedded.mimEstadoPlan;
        this.fondos = items._fondos.content;
        this.tipoPlanes = items._tipoPlanes._embedded.mimTipoPlan;
        this.observaciones = this.idProceso ? items._observaciones : null;
        this.tipoCotizaciones = items._tipoCotizacion._embedded.mimTipoCotizacion;
        this.tipoCuotasGlobal = items._tipoCuotasGlobal._embedded.mimTipoCuotaTotal;
        this.parentescos = items._parentescos._embedded.mimParentesco;
        this.tipoMovimientos = items._tipoMovimientos._embedded.mimTipoMovimiento;
        this.listPlanes = items._mimPlanes.content;
        this.listCondicionesTipo = items._mimCondcionesTipo._embedded.mimCondicionesTipo;
        if (this.codigoPlan) {
          this.listPlanes = this.listPlanes.filter(item => item.codigo !== this.codigoPlan);
          this.backService.planes.getPlan(this.codigoPlan)
            .subscribe((resp: any) => {
              this.plan = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this._initForm(this.plan);
              this.controlAutomaticoPerseverante = this.plan.planAutomaticoPerseverante;
              this.mostrarParentescos = this.plan.aseguradoTercero;
              if (this.plan.mimCondicionPlanList && this.plan.mimCondicionPlanList.length > 0) {
                this.mostrarCondiciones = true;
                for (const rowCondicion of this.plan.mimCondicionPlanList) {
                  this.arrayCondiciones.push(this.crearFilaCondiciones(rowCondicion));
                }
              }

              if (this.plan.mimPlanObligatorioList && this.plan.mimPlanObligatorioList.length > 0) {
                for (const rowPlanObligatorio of this.plan.mimPlanObligatorioList) {
                  this.arrayPlanesObligatorios.push(this.crearFilaPlanObligatorio(rowPlanObligatorio));
                }
              }

              if (this.solicitud !== null && this.solicitud === 'solicitud') {
                this.showForm = true;
              }
              if (this.solicitud !== null) {
                this.form.disable();
                this.estadoFecha = true;
              }
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irListaPlanes();
      });

    });
  }

  _setRowInactivo(row: any) {
    if (!this.tipoPlanSelected(row.mimTipoPlan.codigo)) {
      this.estadosPlanes.push(row.mimTipoPlan);
    }

    if (!this.fondoSelected(row.mimFondo.codigo)) {
      this.fondos.push(row.mimFondo);
    }

    if (!this.estadoFondoSelected(row.mimEstadoPlan.codigo)) {
      this.tipoPlanes.push(row.mimEstadoPlan);
    }
  }


  get arrayPlanesObligatorios() {
    return this.form.controls.arrayPlanesObligatorios as FormArray;
  }

  get arrayCondiciones() {
    return this.form.controls.arrayCondiciones as FormArray;
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(255), CustomValidators.vacio]),
        tipoPlan: new FormControl(param ? this.tipoPlanSelected(param.mimTipoPlan.codigo) : null, [Validators.required]),
        fondo: new FormControl(param ? this.fondoSelected(param.mimFondo.codigo) : null, [Validators.required]),
        estado: new FormControl(param ? this.estadoFondoSelected(param.mimEstadoPlan.codigo) : null, [Validators.required]),
        tipoCotizacion: new FormControl(param ? this.tipoCotizacion(param.mimTipoCotizacion.codigo) : null, [Validators.required]),
        cuotaTotalVlrAsegurado: new FormControl(param ? this.tipoCuotaGlobal(param.mimTipoCuotaTotal.codigo) : null, [Validators.required]),
        parentesco: new FormControl(param ? this.parentescosSelected(param.mimPlanParentescoList) : null),
        valorMinimoContribucion: new FormControl(param ? param.valorMinimoContribucion : null, [Validators.required, Validators.min(0), Validators.maxLength(12)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        edadMinima: new FormControl(param ? param.edadMinIngreso : null, [Validators.required, Validators.max(100), Validators.min(18)]),
        edadMaxima: new FormControl(param ? param.edadMaxIngreso : null, [Validators.required, Validators.max(150), Validators.min(18)]),
        ventaParcial: new FormControl(param ? param.ventaParcial : true, [Validators.required]),
        planAutomaticoPerseverante: new FormControl(param ? param.planAutomaticoPerseverante : false, [Validators.required]),
        condiciones: new FormControl(param ? param.condiciones : false, [Validators.required]),
        aseguradoTercero: new FormControl(param ? param.aseguradoTercero : false, [Validators.required]),
        aseguradoRepetido: new FormControl(param ? param.aseguradoRepetido : false, [Validators.required]),
        ingresosMensuales: new FormControl(param ? param.ingresosMensuales : false, [Validators.required]),
        responsablePago: new FormControl(param ? param.responsablePago : true, [Validators.required]),
        mimPlanAutomaticoPerseverante: new FormControl(param ? this.planPerseverantesSelected(param.mimPlanAutomaticoPerseveranteList) : null),
        fechaInicioFechaFinPerseverante: new FormControl(param ? this.rangoFechaSelected(param.fechaInicioPerseverante, param.fechaFinPerseverante) : null),
        arrayPlanesObligatorios: this.formBuilder.array([]),
        arrayCondiciones: this.formBuilder.array([])
      }, {
        validators: [
          minMaxValidator('edadMinima', 'edadMaxima'),
        ]

      }));

    if (!this._esCreacion) {
      this.form.controls.codigo.disable();
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.estadoFecha = (param && param.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO) || (this.idTarea !== null);

      if (!param.mimFondo.estado) {
        this.form.disable();
      } else {
        if (param && param.mimEstadoPlan.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN.INACTIVO) {
          this.form.disable();
          // this.form.controls.estado.enable();
        }
      }

      if (this.solicitud !== null && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
        this.form.disable();
        this.showForm = true;
      }
      if (this.solicitud !== null || this.idTarea) {
        this.form.disable();
      }
    }

    this.form.controls.planAutomaticoPerseverante.valueChanges.subscribe(r => {
      this.camposObligatoriosPlanAutomatico(r);
    });

    this.form.controls.condiciones.valueChanges.subscribe(r => {
      if (r) {
        this.mostrarCondiciones = true;
        if (this._esCreacion && (!this.arrayCondiciones || this.arrayCondiciones.length === 0)) {
          this.addNewRowCondiciones();
        }
      } else {
        this.arrayCondiciones.clear();
        this.mostrarCondiciones = false;
      }
    });

    this.form.controls.aseguradoTercero.valueChanges.subscribe(r => {
      if (r) {
        this.form.controls.parentesco.setValidators([Validators.required]);
        this.form.controls.parentesco.updateValueAndValidity();
        this.mostrarParentescos = true;
      } else {
        this.mostrarParentescos = false;
        this.form.controls.parentesco.clearValidators();
        this.form.controls.parentesco.setErrors(null);
        this.form.controls.parentesco.setValue(null);
      }
    });

    if (param) {
      this.camposObligatoriosPlanAutomatico(param.planAutomaticoPerseverante);
    } else {
      this.camposObligatoriosPlanAutomatico(false);
    }

  }

  private camposObligatoriosPlanAutomatico(activa: boolean) {
    this.controlAutomaticoPerseverante = activa;
    if (activa) {
      this.form.controls.mimPlanAutomaticoPerseverante.setValidators([Validators.required]);
      this.form.controls.mimPlanAutomaticoPerseverante.updateValueAndValidity();
      this.form.controls.fechaInicioFechaFinPerseverante.setValidators([Validators.required]);
      this.form.controls.fechaInicioFechaFinPerseverante.updateValueAndValidity();
    } else {
      this.form.controls.mimPlanAutomaticoPerseverante.setErrors(null);
      this.form.controls.fechaInicioFechaFinPerseverante.setErrors(null);
    }
  }

  private crearFilaPlanObligatorio(paramPlan?: any): FormGroup {
    let formGroupPlanes: FormGroup = null;

    for (const rowTipoPlan of this.tipoPlanes) {
      if (rowTipoPlan.nombre === GENERALES.MIM_PLANES_OBLIGATORIO.TIPO_PLAN_DEFECTO) {
        this.valorDefectoTPlan = this.tipoPlanSelected(rowTipoPlan.codigo);
      }
    }

    formGroupPlanes = this.formBuilder.group({
      codigoPlanObligatorio: new FormControl(paramPlan && paramPlan.codigo ? paramPlan.codigo : null),
      tipoPlan: new FormControl(paramPlan ? this.tipoPlanSelected(paramPlan.mimTipoPlan.codigo) : this.valorDefectoTPlan, [Validators.required]),
      plan: new FormControl(paramPlan ? paramPlan.mimPlanObliga : null, [Validators.required]),
      tipoSolicitud: new FormControl(paramPlan ? this.tipoMovimientoSelected(paramPlan.mimTipoMovimiento.codigo) : null, [Validators.required]),
      fechaInicioFechaFin: new FormControl(paramPlan ? this.rangoFechaSelected(paramPlan.fechaInicio, paramPlan.fechaFin) : null, [Validators.required]),
      estado: new FormControl(paramPlan ? paramPlan.estado : true, [Validators.required]),
      planesObliglatorios: new FormControl(null)
    });
    this.changeTipoPlan(formGroupPlanes, paramPlan);

    if (paramPlan) {
      formGroupPlanes.controls.tipoPlan.disable();
      formGroupPlanes.controls.plan.disable();
      formGroupPlanes.controls.tipoSolicitud.disable();
    }

    if (this.validarEstadoPlan()) {
      formGroupPlanes.disable();
    }

    return formGroupPlanes;
  }

  private crearFilaCondiciones(paramCondicion?: any): FormGroup {
    const formularioCondiciones = this.formBuilder.group({
      codigoCondiciones: new FormControl(paramCondicion && paramCondicion.codigo ? paramCondicion.codigo : null),
      valor: new FormControl(paramCondicion && paramCondicion.valor ? paramCondicion.valor : null, [Validators.required]),
      mimTipoCondicion: new FormControl(paramCondicion ? this.tipoCondicionSelected(paramCondicion.mimTipoCondicion.codigo) : null, [Validators.required]),
      mimEstado: new FormControl(paramCondicion ? this.estadoFondoSelected(paramCondicion.mimEstado.codigo) : null, []),
      mimPlanCondicion: new FormControl(paramCondicion ? paramCondicion.mimPlanCondicion : null, [])
    });

    if (this.validarEstadoPlan()) {
      formularioCondiciones.disable();
    }

    return formularioCondiciones;
  }

  changeTipoPlan(formGroupPlanes: FormGroup, paramPlan?: any) {
    if (paramPlan && paramPlan.mimTipoPlan.codigo) {
      this.cargarPlanPorTipo(formGroupPlanes, paramPlan.mimTipoPlan.codigo);
    }

    if (!paramPlan && this.valorDefectoTPlan) {
      this.cargarPlanPorTipo(formGroupPlanes, this.valorDefectoTPlan.codigo);
    }

    formGroupPlanes.controls.tipoPlan.valueChanges.subscribe(tipoValor => {
      if (tipoValor) {
        this.cargarPlanPorTipo(formGroupPlanes, tipoValor.codigo);
      }
    });


  }

  cargarPlanPorTipo(formGroupTopes: FormGroup, codigoTipoPlan: number) {
    this.backService.planes.getPlanes({ 'mimTipoPlan.codigo': codigoTipoPlan }).subscribe(response => {
      formGroupTopes.controls.planesObliglatorios.setValue(response.content);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }



  /**
   * Autor: Jose Mulato
   * @param codigo Código del tipo de movimiento
   *
   */
  tipoMovimientoSelected(codigo: string) {
    return this.tipoMovimientos.find(x => x.codigo === codigo);
  }

  /**
    * Autor: Jose Mulato
    * @param obj list
    */
  planPerseverantesSelected(items: any[]) {
    return this.listPlanes.filter(mimPlanAutomaticoPerseverante => items.find(item =>
      item.mimPlanPerseverantePKDto.codigoPlanPerseverante === mimPlanAutomaticoPerseverante.codigo));
  }

  /**
    * Autor: Jose Mulato
    * @param obj list
    */
  parentescosSelected(items: any[]) {
    return this.parentescos.filter(parentesco => items.find(item =>
      item.mimParentescoPKDto.codigoParentesco === parentesco.codigo));
  }


  /**
   * Autor: Jose Mulato
   * @param codigo Codigo del tipo de condicion
   */
  tipoCondicionSelected(codigo: string) {
    return this.listCondicionesTipo.find(x => x.codigo === codigo);
  }


  /**
   * Autor: Cesar Millan
   * @param codigo Código del tipo de plan
   */
  tipoPlanSelected(codigo: string) {
    return this.tipoPlanes.find(x => x.codigo === codigo);
  }
  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del fondo
   */
  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del estado del plan
   */
  estadoFondoSelected(codigo: string) {
    return this.estadosPlanes.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * @param fechaIni Fecha de inicio
   * @param fechaFin Fecha final
   */
  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    if (fechaIni && fechaFin) {
      return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
    } else {
      return null;
    }
  }

  tipoCotizacion(codigo: string) {
    return this.tipoCotizaciones.find(x => x.codigo === codigo);
  }


  tipoCuotaGlobal(codigo: string) {
    return this.tipoCuotasGlobal.find(x => x.codigo === codigo);
  }

  tipoParentescos(codigo: string) {
    return this.parentescos.find(x => x.codigo === codigo);
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
      this._crearPlan();
    } else {
      this._actualizarPlan();
    }
  }

  /**
   * Autor: Jose Mulato
   * Función: Funcion que devuelve el objeto de planes obligatorios
   */
  crearPlanObligatorioList(): IMimPlanObligatorio[] {

    let planesObligatoriosList: IMimPlanObligatorio[] = null;

    if (this.arrayPlanesObligatorios && this.arrayPlanesObligatorios.length > 0) {

      // Se obtiene los valores del objeto planes obligatorios
      planesObligatoriosList = this.arrayPlanesObligatorios.controls.map(c => {
        const fechaInicio = DateUtil.dateToString(c.value.fechaInicioFechaFin[0]);
        const fechaFin = DateUtil.dateToString(c.value.fechaInicioFechaFin[1]);
        const planObligatorio = this.plan ? this.plan.mimPlanObligatorioList.find((item: any) => item.codigo === c.value.codigoPlanObligatorio) : null;
        return {
          codigo: c.value.codigoPlanObligatorio,
          mimPlan: planObligatorio ? planObligatorio.mimPlan : c.value.plan,
          mimPlanObliga: planObligatorio ? planObligatorio.mimPlanObliga : c.value.plan,
          mimTipoPlan: planObligatorio ? planObligatorio.mimTipoPlan : c.value.tipoPlan,
          mimTipoMovimiento: planObligatorio ? planObligatorio.mimTipoMovimiento : c.value.tipoSolicitud,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          estado: c.value.estado
        } as IMimPlanObligatorio;
      });
    }
    return planesObligatoriosList;
  }


  /**
   * Autor: Jose Mulato
   * Función: Funcion que devuelve el objeto de condiciones
   */
  crearCondicionesList(codigoPlanPadre): any[] {
    let condicionesList: any[] = null;
    if (this.arrayCondiciones && this.arrayCondiciones.length > 0) {

      // Se obtiene los valores del objeto planes obligatorios
      condicionesList = this.arrayCondiciones.controls.map(c => {
        return {
          codigo: c.value.codigoCondiciones,
          mimTipoCondicion: c.value.mimTipoCondicion,
          valor: c.value.valor,
          mimEstado: c.value.mimEstado,
          mimPlan: { codigo: codigoPlanPadre },
          mimPlanCondicion: c.value.mimPlanCondicion
        } as any;
      });
    }

    return condicionesList;
  }




  /**
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  _crearPlan() {
    let fechaInicioPerseverante;
    let fechaFinPerseverancia;
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0]);
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1]);

    if (form.fechaInicioFechaFinPerseverante !== null) {
      fechaInicioPerseverante = DateUtil.dateToString(form.fechaInicioFechaFinPerseverante[0]);
      fechaFinPerseverancia = DateUtil.dateToString(form.fechaInicioFechaFinPerseverante[1]);
    }

    const plan = {
      nombre: form.nombre,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      edadMinIngreso: form.edadMinima,
      edadMaxIngreso: form.edadMaxima,
      mimTipoPlan: { codigo: form.tipoPlan.codigo },
      mimEstadoPlan: { codigo: form.estado.codigo },
      mimFondo: { codigo: form.fondo.codigo },
      mimTipoCotizacion: { codigo: form.tipoCotizacion.codigo },
      mimTipoCuotaTotal: { codigo: form.cuotaTotalVlrAsegurado.codigo },
      ventaParcial: form.ventaParcial,
      mimPlanAutomaticoPerseveranteList: form.mimPlanAutomaticoPerseverante ? form.mimPlanAutomaticoPerseverante.map(mimPlanAutomaticoPerseverante => {
        return { mimPlanPerseverante: { codigo: mimPlanAutomaticoPerseverante.codigo } };
      }) : null,
      mimPlanParentescoList: form.parentesco ? form.parentesco.map(parentesco => {
        return { mimPlanParentesco: { codigo: parentesco.codigo } };
      }) : null,
      fechaInicioPerseverante: fechaInicioPerseverante,
      fechaFinPerseverante: fechaFinPerseverancia,
      mimCondicionPlanList: form.condiciones === false ? null : this.crearCondicionesList(null),
      planAutomaticoPerseverante: form.planAutomaticoPerseverante,
      condiciones: form.condiciones,
      responsablePago: form.responsablePago,
      aseguradoTercero: form.aseguradoTercero,
      aseguradoRepetido: form.aseguradoRepetido,
      ingresosMensuales: form.ingresosMensuales,
      valorMinimoContribucion: form.valorMinimoContribucion,
      mimPlanObligatorioList: this.crearPlanObligatorioList()
    };
    this.backService.planes.postPlan(plan).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaPlanes();
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
  _actualizarPlan() {
    let fechaInicioPerseverante;
    let fechaFinPerseverancia;
    const form: any = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0]);
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1]);

    if (form.fechaInicioFechaFinPerseverante !== null) {
      fechaInicioPerseverante = DateUtil.dateToString(form.fechaInicioFechaFinPerseverante[0]);
      fechaFinPerseverancia = DateUtil.dateToString(form.fechaInicioFechaFinPerseverante[1]);
    }
    const plan = {
      codigo: form.codigo,
      nombre: form.nombre,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      edadMinIngreso: form.edadMinima,
      edadMaxIngreso: form.edadMaxima,
      mimTipoPlan: { codigo: form.tipoPlan.codigo },
      mimEstadoPlan: { codigo: form.estado.codigo },
      mimFondo: { codigo: form.fondo.codigo },
      mimTipoCotizacion: { codigo: form.tipoCotizacion.codigo },
      mimParentesco: form.parentesco ? { codigo: form.parentesco.codigo } : null,
      mimTipoCuotaTotal: { codigo: form.cuotaTotalVlrAsegurado.codigo },
      ventaParcial: form.ventaParcial,
      mimPlanAutomaticoPerseveranteList: form.mimPlanAutomaticoPerseverante ? form.mimPlanAutomaticoPerseverante.map(mimPlanAutomaticoPerseverante => {
        return { mimPlanPerseverante: { codigo: mimPlanAutomaticoPerseverante.codigo } };
      }) : null,
      mimPlanParentescoList: form.parentesco ? form.parentesco.map(parentesco => {
        return { mimPlanParentesco: { codigo: parentesco.codigo } };
      }) : null,
      fechaInicioPerseverante: fechaInicioPerseverante,
      fechaFinPerseverante: fechaFinPerseverancia,
      mimCondicionPlanList: form.condiciones === false ? null : this.crearCondicionesList(form.codigo),
      planAutomaticoPerseverante: form.planAutomaticoPerseverante,
      condiciones: form.condiciones,
      responsablePago: form.responsablePago,
      aseguradoTercero: form.aseguradoTercero,
      aseguradoRepetido: form.aseguradoRepetido,
      ingresosMensuales: form.ingresosMensuales,
      valorMinimoContribucion: form.valorMinimoContribucion,
      mimPlanObligatorioList: this.crearPlanObligatorioList()
    };

    this.backService.planes.putPlan(this.codigoPlan, plan).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._esCreacion = true;
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaPlanes();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar
   */
  _irListaPlanes() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES
    ]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    const _datos = {
      ...datos,
      codigoPlan: this.codigoPlan,
      codigoSolicitudPadre: GENERALES.CODIGO_SOLICITUD_PADRE,
      codigoSolicitud: this.codigoPlan.toString(),
      nombreSolicitud: this.form.controls.nombre.value,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_ELIMINAR_PLAN,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_ELIMINAR_PLAN
    };

    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.ELIMINAR_PLAN, _datos).subscribe((resp: any) => {

      this.translate.get('global.solicitudEliminacionEnviada').subscribe((getMensaje: string) => {
        this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: resp }).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje);
        });
      });

      this._irListaPlanes();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _apruebaRechazaSolicitud(datos: any) {

    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {
      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : 'global.solicitudRechazadaMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });
      this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    if (!showModal && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
      this._irListaPlanes();
    }
  }

  onDeleteRow(index: number) {
    this.arrayPlanesObligatorios.markAsDirty({ onlySelf: false });
    this.arrayPlanesObligatorios.removeAt(index);

    if (this.arrayPlanesObligatorios.length === 0) {
      this.arrayPlanesObligatorios.clear();
    }

  }

  onDeleteRowCondiciones(index: number) {
    this.arrayCondiciones.markAsDirty({ onlySelf: false });
    this.arrayCondiciones.removeAt(index);

    if (this.arrayCondiciones.length === 0) {
      this.arrayCondiciones.clear();
    }
  }

  addNewRow(): void {
    if (this.arrayPlanesObligatorios.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    this.arrayPlanesObligatorios.push(this.crearFilaPlanObligatorio());
  }

  addNewRowCondiciones(): void {
    if (this.arrayCondiciones.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    this.arrayCondiciones.push(this.crearFilaCondiciones());
  }

  getControls(index: number) {
    return this.arrayPlanesObligatorios.controls[index]['controls'];
  }

  getControlsCondiciones(index: number) {
    return this.arrayCondiciones.controls[index]['controls'];
  }

  validarEstadoPlan(): boolean {
    if (!this._esCreacion) {
      return !this.plan.mimFondo.estado && this.plan.mimFondo.mimCliente.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.INACTIVO;
    }
    return false;
  }

  configurarMascaraValores(): any {
    return {
      align: 'left',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 0,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: true,
      min: null,
      max: null,
      inputMode: CurrencyMaskInputMode.NATURAL
    };
  }
}
