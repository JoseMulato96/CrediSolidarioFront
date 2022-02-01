import { Component, OnInit, OnDestroy, ViewEncapsulation, forwardRef, ComponentFactoryResolver } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import * as acciones from '../portafolio.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MenuItem } from 'primeng/api';
import { DateUtil } from '@shared/util/date.util';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { FormValidate } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { AlertService } from '@core/services';

@Component({
  selector: 'app-cotizacion-plan',
  templateUrl: './cotizacion-plan.component.html',
  styleUrls: ['./cotizacion-plan.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CotizacionPlanComponent),
      multi: true
    }
  ]
})
export class CotizacionPlanComponent extends FormValidate implements OnInit, OnDestroy {
  activeIndex = 0;
  items: MenuItem[];

  form: FormGroup;
  isForm: Promise<any>;

  precargaLista: boolean;
  canalVentas: any[];
  tipoPlanes: any;
  planes: any;
  tipoCotizaciones: any[];
  planesAll: any;
  fondos: any;
  cualProyectoVida: any;
  promotoresComerciales: any[];
  porcentajeCuota: any;
  movimientoPlanCanal: any;
  mimPlanCanalVenta: any[];
  subs: Subscription[] = [];

  asoNumInt = '';
  datosAsociado: any;
  sipVinculaciones: any;

  datosForm: any;
  datosFormCopy: any;
  dataInitValidar: any;
  dataInitCotizar: any;
  dataInitPlanes: any;
  dataInitInfoPlan: any;
  dataInitTipoCalculo: any;
  edadCotizacion: number;
  bloquearBotonFinalizar: boolean;
  codigoCotizacion: string;
  esCrear: boolean;
  bloquearFechaSolicitud: boolean;

  //mostrar componentes
  agregarPlan: boolean;
  infoPlan: boolean;
  habilitaBoton: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) {
    super();
    this.precargaLista = false;
    this.canalVentas = [];
    this.mimPlanCanalVenta = [];
    this.promotoresComerciales = [];
    this.planesAll = [];
    this.tipoPlanes = [];
    this.esCrear = true;
    this.bloquearFechaSolicitud = false;
    this.agregarPlan = false;
    this.infoPlan = false;
  }

  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));

    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.route.params.subscribe((params: any) => {
      this.codigoCotizacion = params.codigo;
      this.esCrear = params.codigo ? false : true;
    });

    this.subs.push(this.dataService
      .asociados()
      .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
        if (!respuesta) {
          return;
        }
        this.datosAsociado = respuesta.datosAsociado;
        this.configurarEdadCotizacion();

        this.precargarDatos();

      }));

    this.items = [{
      label: 'Validar datos',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'Cotizar Plan',
      command: async (event: any) => {
        if (!this.precargaLista) {
          return;
        }

        this.continuar();
      }
    }];

    ;
  }

  precargarDatos() {

    let consultas = {
      _sipVinculaciones: this.backService.vinculacion.getSipVinculaciones({ asoNumInt: this.asoNumInt }),
      _proyectoVida: this.backService.proyectoVida.getProyectosVida({ estado: true }),
      _salarioMinimo: this.backService.asociado.getSalarioMinimo(new Date(), new Date()),
      _movimientoPlanCanal: this.backService.movimientoPlanCanal.getMimMovimientoPlanCanal(
        {
          'mimTipoMovimiento.codigo': MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.COTIZACION,
          //fechaVigencia: DateUtil.dateToString(new Date(), 'dd-MM-yyyy'), se quita el parametro de fecha actual
          'mimPlanCanalVenta.mimPlan.mimPlanNivelRiesgoList.mimPlanNivelRiesgoPK.codigoNivelRiesgo': this.datosAsociado.nivelRiesgo,
          edadIngresoPlan: this.edadCotizacion,
          'mimPlanCanalVenta.mimPlan.mimEstadoPlan.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO
        }
      ),
      _tipoCotizaciones: this.backService.tipoCotizacion.getTipoCotizacion({ estado: true }),
      _tipoPlanes: this.backService.tipoPlanes.getTipoPlanes({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
      _frecuenciaFacturacion: this.backService.frecuenciaFacturacion.getFrecuenciasFacturaciones({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
      _mediosFacturacion: this.backService.mediosFacturacion.listarMediosFacturacion({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 })
    } as any;

    if (!this.esCrear) {
      consultas = {
        ...consultas,
        _mimCotizacion: this.backService.cotizacion.getCotizacion(this.codigoCotizacion)
      };
    }

    forkJoin(consultas).subscribe(async (resp: any) => {
      let mimCotizacion = null;
      let mensajesParaMostrar = '';
      this.sipVinculaciones = resp._sipVinculaciones.content[0];
      if (this.sipVinculaciones.mimControlCumuloList.length <= 0) {
        mensajesParaMostrar = await this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.alertas.noCUmulosParaPlan').toPromise();
        this.fillCumulosList(this.sipVinculaciones);
      }

      this.movimientoPlanCanal = resp._movimientoPlanCanal.content;
      if (resp._movimientoPlanCanal.content.length <= 0) {
        mensajesParaMostrar = mensajesParaMostrar
          + ' <br /> <br /> '
          + await this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.alertas.noPlanCanalMovimiento').toPromise();
      }
      if (mensajesParaMostrar !== '') {
        this.frontService.alert.info(mensajesParaMostrar).then(() => {
          this.router.navigate([
            UrlRoute.PAGES,
            UrlRoute.CONSULTAS,
            UrlRoute.CONSULTAS_ASOCIADO,
            this.asoNumInt,
            UrlRoute.PROTECCIONES,
            UrlRoute.PORTAFOLIO_BETA,
            UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
          ]);
        });
      }
      this.mimPlanCanalVenta = this.movimientoPlanCanal;
      this.canalVentas = this.removerRepetidos(this.movimientoPlanCanal.map(x => x.mimPlanCanalVenta.mimCanalVenta));
      this.canalVentas.sort((a, b) => b.nombre - a.nombre);
      this.cualProyectoVida = [...resp._proyectoVida.content, { codigo: 0, nombre: 'Otro' }];

      const _porcentajeCuota: any = await this.backService.porcentajeCuotas.getPorcentajeCuotas({
        'sipCategoriaAsociado.codigo': this.sipVinculaciones.sipVinculacionesClasificacion.sipVinculacionesTipo.vinCod, estado: true
      }).toPromise();
      this.porcentajeCuota = _porcentajeCuota.content[0];

      if (!this.esCrear) {
        this.bloquearFechaSolicitud = true;
        this.datosForm = resp._mimCotizacion;
        mimCotizacion = resp._mimCotizacion;
        mimCotizacion.mimCotizacionDetalleSet = mimCotizacion.mimCotizacionDetalleSet.filter(mimCotizacionDetalle => mimCotizacionDetalle.cuota !== 0 && mimCotizacionDetalle.valorProteccion !== 0);

        await this.configurarDesplegables(this.datosForm.mimCanal);
        this.initForm(this.datosForm);
        this.simular();

      } else {
        // Configuramos los datos basicos que ya tenemos.
        this.datosForm = {
          asoNumInt: this.asoNumInt,
          fechaSolicitud: DateUtil.dateToString(new Date(), 'dd-MM-yyyy'),
          mimTipoMovimiento: {
            codigo: MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.COTIZACION
          },
          tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
          mimEstadoCotizacion: {
            codigo: MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE
          }
        };
        this.initForm(this.datosForm);
      }


      this.dataInitValidar = {
        canalVentas: this.canalVentas,
        promotoresComerciales: this.promotoresComerciales,
        tipoCotizaciones: null,
        bloquearFechaSolicitud: this.bloquearFechaSolicitud
      };

      this.dataInitPlanes = {
        planes: this.planes
      };

      this.tipoCotizaciones = resp._tipoCotizaciones._embedded.mimTipoCotizacion;
      this.tipoPlanes = resp._tipoPlanes._embedded.mimTipoPlan;

      this.dataInitCotizar = {
        fondos: this.fondos,
        tipoPlanes: this.tipoPlanes,
        planes: this.planes,
        cualProyectoVida: this.cualProyectoVida,
        salarioMinimo: resp._salarioMinimo,
        rentaDiariaRecomendada: this.datosForm.rentaDiaria || 0,
        tipoCotizaciones: this.tipoCotizaciones
      };

      this.dataInitInfoPlan = {
        listFrecuenciasFacturacion: resp._frecuenciaFacturacion._embedded.mimFrecuenciaFacturacion,
        listMediosFacturacion: resp._mediosFacturacion._embedded.mimMedioFacturacion
      }

      this.dataInitTipoCalculo = {
        porcentajeCuota: this.porcentajeCuota,
        mimCotizacion: mimCotizacion || null
      };

      this.precargaLista = true;
    }, err => {
      this.frontService.alert.error(err.error.message).then(() => {
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
        ]);
      });
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach((item: Subscription) => item.unsubscribe());
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        validarDatos: this.formBuilder.group({
          fechaSolicitud: [param ? param.fechaSolicitud : null, [Validators.required]],
          canalVenta: [param && param.mimCanal ? this.obtenerMimCanal(param.mimCanal.codigo) : null, [Validators.required]],
          promotorComercial: [param ? this.obtenerPromotorComercial(+param.promotorComercial) : null, [Validators.required]],
          aceptaTratamientoDatosPersonales: [null, [Validators.required]]

        }),
        cotizarProteccion: this.formBuilder.group({
          fondo: [param && param.mimPlan ? this.obtenerMimFondo(param.mimPlan.mimFondo.codigo) : null, [Validators.required]],
          tipoPlan: [param && param.mimPlan ? this.obtenerMimTipoPlan(param.mimPlan.mimTipoPlan.codigo) : null, [Validators.required]],
          plan: [param && param.mimPlan ? this.obtenerMimPlan(param.mimPlan.codigo) : null, [Validators.required]],
          tipoCotizacion: [param && param.tipoCotizacion ? this.obtenerMimTipoCotizacion(param.tipoCotizacion.codigo) : null, [Validators.required]],
          cualProyectoVida: [param && param.mimProyectoVida ?
            this.obtenerMimProyectoVida(param.mimProyectoVida.codigo)
            : !this.esCrear ? this.obtenerMimProyectoVida(0) : null, [Validators.required]],
          cual: [param ? param.otroProyectoVida : null],
          ingresos: [param ? param.ingresosMensuales : null, [Validators.required]]
        }),
        tipoCalculo: this.formBuilder.group({
          rdTipoCalculo: [param ? String(param.tipoCalculo) : null],
          valorCuota: [param ? +(param.porcentajeValorCuota * 100).toFixed(4) : null, { updateOn: 'blur' }],
          mimCotizacionDetalleSet: [param ? param.mimCotizacionDetalleSet : [], [Validators.required]]
        }),
        agregarPlan: this.formBuilder.group({
          plan: [null, [Validators.required]],
          operacionSolicita: [true, [Validators.required]],
        }),
        infoPlan: this.formBuilder.group({
          frecuenciaFacturacion: [null, [Validators.required]],
          mediosFacturacion: [null, [Validators.required]],
          totalCuota: ['12300', [Validators.required]]
        })
      })
    );
    this.form.controls.cotizarProteccion['controls'].cual.disable();
    this.form.controls.infoPlan['controls'].totalCuota.disable();
    this.form.controls.validarDatos['controls'].canalVenta.disable();

    if (!this.esCrear) {
      this.form.controls.validarDatos['controls'].fechaSolicitud.disable();
      this.form.controls.validarDatos['controls'].canalVenta.disable();
      this.form.controls.validarDatos['controls'].promotorComercial.disable();
      this.form.controls.cotizarProteccion['controls'].fondo.disable();
      this.form.controls.cotizarProteccion['controls'].plan.disable();
      this.form.controls.cotizarProteccion['controls'].tipoPlan.disable();
    }

    this._validarTratamientoDatos();
    this.changevalidarDatos();
    this.changeCotizarProteccion();
    this.changeTipoCalculo();
    this.changeAgregarPlan();
  }

  private initTipoCalculoForm(param?: any) {
    this.form.controls.tipoCalculo = this.formBuilder.group({
      rdTipoCalculo: [param ? String(param.tipoCalculo) : null],
      valorCuota: [param ? +(param.porcentajeValorCuota * 100).toFixed(4) : null, { updateOn: 'blur' }],
      mimCotizacionDetalleSet: [param ? param.mimCotizacionDetalleSet : [], [Validators.required]]
    });

    this.changeTipoCalculo();
  }

  private changevalidarDatos() {
    const _validaDatos = this.form.controls.validarDatos['controls'];
    const _cotizarProteccion = this.form.controls.cotizarProteccion['controls'];
    this._validarFechaSolicitud(_validaDatos.fechaSolicitud.value, false);

    _validaDatos.fechaSolicitud.valueChanges.subscribe((resp) => {
      this._validarFechaSolicitud(resp, true);
    });

    _validaDatos.canalVenta.valueChanges.subscribe(async mimCanalVenta => {
      if (mimCanalVenta === null || mimCanalVenta === undefined) {
        return;
      }

      // Limpiamos los componentes relacionados al cambio.
      this.datosForm = {
        ...this.datosForm,
        mimFondo: null,
        mimTipoPlan: null,
        mimPlan: null,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      this.initTipoCalculoForm(this.datosForm);
      // Limpiamos los controles.
      _validaDatos.promotorComercial.setValue(null);
      _cotizarProteccion.fondo.setValue(null, { emitEvent: false });
      _cotizarProteccion.tipoPlan.setValue(null, { emitEvent: false });

      await this.configurarDesplegables(mimCanalVenta);

      this.dataInitValidar = {
        ...this.dataInitValidar,
        promotoresComerciales: this.promotoresComerciales
      };

    });
  }

  async _validarFechaSolicitud(fechaParam: any, fechaEditada: boolean) {
    let fecha;
    if (fechaEditada) {
      fecha = fechaParam;
    } else {
      fecha = DateUtil.stringToDate(fechaParam);
    }

    //Se valida que la fecha no pueda ser 30 dias mayor a la actual
    const today = new Date();
    const daysBetween = DateUtil.obtenerDiasEntre({
      fechaInicio: today,
      fechaFin: fecha
    });
    const diasMax = await this.backService.parametro.getParametro(SIP_PARAMETROS_TIPO.GENERALES.TIP_COD, SIP_PARAMETROS_TIPO.GENERALES.CODIGO.DIAS_MAX_SOLICITUD_COTIZACION).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });
    if (daysBetween > diasMax.valor) {
      this.form.controls.validarDatos['controls'].canalVenta.disable();
      let param = diasMax.valor;
      this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.fechaMayor30', { param }).subscribe(mensaje => {
        this.frontService.alert.warning(mensaje);
      });
    }
    else {
      //Se valida que la fecha de solicitud sobre la vigencia de los canales
      this.movimientoPlanCanal = this.mimPlanCanalVenta;
      let listaCnalesValidos: any[] = [];
      for (let item of this.mimPlanCanalVenta) {
        if (fecha >= DateUtil.stringToDate(item.mimPlanCanalVenta.fechaInicio) && fecha <= DateUtil.stringToDate(item.mimPlanCanalVenta.fechaFin)) {
          listaCnalesValidos.push(item);
        }
      }
      if (listaCnalesValidos.length > 0) {
        this.movimientoPlanCanal = listaCnalesValidos;  //Pendiente por validar
        this.canalVentas = listaCnalesValidos;
        this.canalVentas = this.removerRepetidos(this.movimientoPlanCanal.map(x => x.mimPlanCanalVenta.mimCanalVenta));
        this.canalVentas.sort((a, b) => b.nombre - a.nombre);
        this.dataInitValidar = {
          ...this.dataInitValidar,
          canalVentas: this.canalVentas
        };
        this.form.controls.validarDatos['controls'].canalVenta.enable();
      }
      else {
        this.form.controls.validarDatos['controls'].canalVenta.disable();
        this.form.controls.validarDatos['controls'].canalVenta.setValue(null);
        this.form.controls.validarDatos['controls'].promotorComercial.setValue(null);
        this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.alertas.noPlanCanalMovimiento').subscribe(mensaje => {
          this.frontService.alert.warning(mensaje);
        });
      }
    }
  }

  _validarTratamientoDatos() {
    const _validaDatos = this.form.controls.validarDatos['controls'];
    _validaDatos.aceptaTratamientoDatosPersonales.valueChanges.subscribe((seleccion) => {
      if (seleccion == "2") { //El digito dos se toma como un valor "No"
        this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.tratamientoDatos').subscribe(mensaje => {
          this.frontService.alert.warning(mensaje);
        });
      }
    });
  }

  private changeAgregarPlan() {
    const _agregarPlan = this.form.controls.agregarPlan['controls'];

    _agregarPlan.plan.valueChanges.subscribe((plan: any) => {
      if (plan === null || plan === undefined) {
        return;
      }
      this.dataInitInfoPlan = {
        ... this.dataInitInfoPlan,
        nombrePlan: plan.nombre
      }
    });
  }

  private changeCotizarProteccion() {
    const _cotizarProteccion = this.form.controls.cotizarProteccion['controls'];

    _cotizarProteccion.tipoCotizacion.valueChanges.subscribe((tipoCotizacion:any) => {
      if(tipoCotizacion.codigo == MIM_PARAMETROS.MIM_TIPO_COTIZACION.UNICA){
        this.habilitarAgregarPlan(true);
        this.habilitaBoton = false;
      }else{
        this.habilitaBoton = true;
      }
    });

    _cotizarProteccion.cualProyectoVida.valueChanges.subscribe(mimProyectoVida => {
      if (mimProyectoVida === null || mimProyectoVida === undefined) {
        return;
      }
      this.bloquearBotonFinalizar = false;
      if (mimProyectoVida.codigo === 0) {
        _cotizarProteccion.cual.setValidators([Validators.required]);
        _cotizarProteccion.cual.enable();
      } else {
        _cotizarProteccion.cual.disable();
        _cotizarProteccion.cual.setValidators(null);
        _cotizarProteccion.cual.setValue(null);
      }
    });

    _cotizarProteccion.fondo.valueChanges.subscribe(mimFondo => {
      if (mimFondo === null || mimFondo === undefined) {
        return;
      }

      // Consultamos mimPlanSet para mimFondo seleccionado.
      const _planes = this.planesAll.filter(item => item.mimFondo.codigo === mimFondo.codigo);
      this.planes = _planes.sort((a, b) => b.nombre - a.nombre);

      // Consultamos mimTipoPlanSet para los mimPlan disponibles.
      let _tipoPlanes = [];
      this.planes.forEach(mimPlan => {
        _tipoPlanes.push(mimPlan.mimTipoPlan);
      });
      _tipoPlanes = this.removerRepetidos(_tipoPlanes);
      this.tipoPlanes = _tipoPlanes;
      this.dataInitCotizar = {
        ...this.dataInitCotizar,
        planes: this.planes,
        tipoPlanes: this.tipoPlanes
      };
      this.dataInitPlanes = {
        planes: this.planes
      }

      this.datosForm = {
        ...this.datosForm,
        mimFondo: mimFondo,
        mimTipoPlan: null,
        mimPlan: null,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      // Siempre que ocurre un cambio en mimTipoPlan o mimPlan debemos restaurar tipoCalculo.
      this.initTipoCalculoForm(this.datosForm);
      // Además para fondo se debe limpiar mimTipoPlan y mimPlan.
      _cotizarProteccion.tipoPlan.setValue(null, { emitEvent: false });
      _cotizarProteccion.plan.setValue(null, { emitEvent: false });
    });

    _cotizarProteccion.tipoPlan.valueChanges.subscribe(mimTipoPlan => {
      if (mimTipoPlan === null || mimTipoPlan === undefined) {
        return;
      }
      // Consultamos mimPlanSet para mimTipoPlan seleccionado.
      const _planes = this.planes.filter(item => item.mimTipoPlan.codigo === mimTipoPlan.codigo);
      this.planes = _planes.sort((a, b) => b.nombre - a.nombre);
      this.dataInitCotizar = {
        ...this.dataInitCotizar,
        planes: this.planes
      };

      this.datosForm = {
        ...this.datosForm,
        mimTipoPlan: mimTipoPlan,
        mimPlan: null,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      // Siempre que ocurre un cambio en mimTipoPlan o mimPlan debemos restaurar tipoCalculo.
      this.initTipoCalculoForm(this.datosForm);
      // Adem;ás para tipo plan se debe limpiar mimPlan.
      _cotizarProteccion.plan.setValue(null, { emitEvent: false });
    });

    _cotizarProteccion.plan.valueChanges.subscribe(mimPlan => {
      if (mimPlan === null || mimPlan === undefined) {
        return;
      }
      this.datosFormCopy = JSON.parse(JSON.stringify(this.datosForm));
      this.datosForm = {
        ...this.datosForm,
        codigoPlan: mimPlan.codigo,
        mimPlan: mimPlan,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      // Siempre que ocurre un cambio en mimTipoPlan o mimPlan debemos restaurar tipoCalculo.
      this.initTipoCalculoForm(this.datosForm);
      this.simular();
    });

    _cotizarProteccion.ingresos.valueChanges.subscribe(ingresosMensuales => {
      if (ingresosMensuales === null || ingresosMensuales === undefined || ingresosMensuales === '') {
        this.datosForm.rentaDiaria = 0;
        this.datosForm.ingresosMensuales = null;
        return;
      }
      if (this.dataInitCotizar.salarioMinimo.smmlv <= ingresosMensuales) {
        this.datosFormCopy = JSON.parse(JSON.stringify(this.datosForm));
        this.datosForm = {
          ...this.datosForm,
          ingresosMensuales: ingresosMensuales
        };
        if (!_cotizarProteccion.plan.value) {
          this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.seleccionarPlan').subscribe(mensaje => {
            this.frontService.alert.info(mensaje);
          });
          return;
        }
        this.simular();
      } else {
        this.datosForm.rentaDiaria = 0;
      }
    });

  }

  private changeTipoCalculo() {
    const _tipoCalculo = this.form.controls.tipoCalculo['controls'];

    _tipoCalculo.rdTipoCalculo.valueChanges.subscribe(tipoCalculo => {
      if (tipoCalculo === null || tipoCalculo === undefined) {
        return;
      }
      if (+tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION && !this.porcentajeCuota) {
        this.translate.get('asociado.protecciones.portafolio.venta.alertas.noHayPorcentajeConfigurado', { codigo: this.datosAsociado.claVin }).subscribe(mensaje => {
          this.frontService.alert.info(mensaje).then(() => {
            _tipoCalculo.rdTipoCalculo.setValue(MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION.toString(), { emitEvent: false });
            this.datosForm.tipoCalculo = MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION;
            return;
          });
        });
      } else {
        this.datosForm.tipoCalculo = +tipoCalculo;
      }
    });

    _tipoCalculo.valorCuota.valueChanges.subscribe(valorCuota => {
      if (valorCuota === null || valorCuota === undefined) {
        return;
      }
      this.datosFormCopy = JSON.parse(JSON.stringify(this.datosForm));
      const porcentajeValorCuota = +(valorCuota / 100).toFixed(4);
      this.datosForm = {
        ...this.datosForm,
        porcentajeValorCuota: porcentajeValorCuota
      };
      this.simular();
    });

    _tipoCalculo.mimCotizacionDetalleSet.valueChanges.subscribe(mimCotizacionDetalleSet => {
      if (mimCotizacionDetalleSet === null || mimCotizacionDetalleSet === undefined) {
        return;
      }
      this.datosFormCopy = JSON.parse(JSON.stringify(this.datosForm));
      this.datosForm = {
        ...this.datosForm,
        mimCotizacionDetalleSet: mimCotizacionDetalleSet,
      };

      const esTipoCalculoValorCuotaProteccion = +_tipoCalculo.rdTipoCalculo.value === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION;
      const esUnaEliminacion = this.datosFormCopy.mimCotizacionDetalleSet !== null && this.datosFormCopy.mimCotizacionDetalleSet !== undefined &&
        this.datosForm.mimCotizacionDetalleSet !== null && this.datosForm.mimCotizacionDetalleSet !== undefined
        && this.datosFormCopy.mimCotizacionDetalleSet.length !== this.datosForm.mimCotizacionDetalleSet.length;
      // Si el tipo de calculo es VALOR_CUOTA_PROTECCION y no es una eliminacion entonces configuramos VALOR_CUOTA
      if (esTipoCalculoValorCuotaProteccion && !esUnaEliminacion) {
        this.datosForm.tipoCalculo = MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA;
      }
      this.simular();
    });
  }

  private obtenerMimCanal(codigo: any): any {
    return this.canalVentas ? this.canalVentas.find(mimCanal => mimCanal.codigo === codigo) : null;
  }

  private obtenerPromotorComercial(identificacion: any): any {
    return this.promotoresComerciales ? this.promotoresComerciales.find(promotorComercial => +promotorComercial.numeroIdentificacion === identificacion) : null;
  }

  private obtenerMimPlan(codigo: any): any {
    return this.planes ? this.planes.find(mimPlan => mimPlan.codigo === codigo) : null;
  }

  private obtenerMimTipoCotizacion(codigo: any): any {
    return this.tipoCotizaciones ? this.tipoCotizaciones.find((tipoCotizacion: any) => tipoCotizacion.codigo === codigo) : null;
  }

  private obtenerMimFondo(codigo: any): any {
    return this.fondos ? this.fondos.find(mimFondo => mimFondo.codigo === codigo) : null;
  }

  private obtenerMimTipoPlan(codigo: any): any {
    return this.tipoPlanes ? this.tipoPlanes.find(mimTipoPlan => mimTipoPlan.codigo === codigo) : null;
  }

  private obtenerMimProyectoVida(codigo: any): any {
    return this.cualProyectoVida ? this.cualProyectoVida.find(mimProyectoVida => mimProyectoVida.codigo === codigo) : null;
  }

  submit() {
    // do nothing
  }

  atras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
    ]);
  }

  async continuar() {
    if (this.form.controls.validarDatos.invalid) {
      this.validateForm(this.form.controls.validarDatos as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    //Se valida el tipo de canal seleccionado
    //Se obtiene la info de mora
    let totalNumeroCuotas: any = 0;
    let totalValorMora: any = 0;
    let facturas: any;
    const factura = await this.backService.portafolioAsociadosDetalle.getFacturasDetalle(this.asoNumInt).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });
    facturas = factura;
    for (var item of facturas) {
      let fechaPago = DateUtil.stringToDate(item.fechaPago);
      let fechaActual = new Date();
      if (item.estado === SIP_PARAMETROS_TIPO.SIP_ESTADO_FACTURA.PENDIETE_PAGO && fechaPago < fechaActual) {
        totalNumeroCuotas = totalNumeroCuotas + 1;
        totalValorMora = totalValorMora + item.valorMora;
      }
    }

    //Se optiene la parametrizacion de max cutas Mora y max valor mora
    const valorMoraMaxPermitida = await this.backService.parametro.getParametro(SIP_PARAMETROS_TIPO.GENERALES.TIP_COD, SIP_PARAMETROS_TIPO.GENERALES.CODIGO.VALOR_MAX_MORA_PERMITIDA).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });
    const cuotasMoraMaxPermitida = await this.backService.parametro.getParametro(SIP_PARAMETROS_TIPO.GENERALES.TIP_COD, SIP_PARAMETROS_TIPO.GENERALES.CODIGO.NUMERO_CUOTAS_AX_PERMITIDA).toPromise().catch(err => {
      this.frontService.alert.warning(err.error.message);
    });

    const _validaDatos = this.form.controls.validarDatos['controls'];
    if (_validaDatos.canalVenta.value.codigo === MIM_PARAMETROS.MIM_CANALES_VENTA.CALL_CENTER) {
      //validar que el número de cuotas en mora del responsable de pago NO supere el número de cuotas en mora parametrizadas: debe dejar continuar
      if (totalNumeroCuotas > cuotasMoraMaxPermitida.valor) {
        this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.numeroCuotaMax').subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
      }
    }
    if (_validaDatos.canalVenta.value.codigo !== MIM_PARAMETROS.MIM_CANALES_VENTA.CALL_CENTER) {
      //validar si el responsable de pago tiene un valor en mora activo y Si el valor en mora es mayor al valor máximo de mora parametrizado: permite continuar
      if (totalValorMora > valorMoraMaxPermitida.valor) {
        this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.valorMoraMax', { totalValorMora }).subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
      }
    }

    if (_validaDatos.aceptaTratamientoDatosPersonales.value == "2") {
      this.translate.get('asociado.protecciones.portafolio.cotizacion.alertas.tratamientoDatos').subscribe(mensaje => {
        this.frontService.alert.warning(mensaje);
      });
    }
    const _form = this.form.getRawValue();
    this.datosForm = {
      ...this.datosForm,
      fechaSolicitud: _form.validarDatos.fechaSolicitud,
      mimCanal: _form.validarDatos.canalVenta,
      promotorComercial: _form.validarDatos.promotorComercial.numeroIdentificacion
    };

    this.activeIndex = 1;
  }

  async finalizar() {
    this.bloquearBotonFinalizar = true;
    if (this.form.invalid) {
      this.validateForm(this.form as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const _form = this.form.getRawValue();
    this.datosForm = {
      ...this.datosForm,
      fechaSolicitud: _form.validarDatos.fechaSolicitud,
      mimCanal: _form.validarDatos.canalVenta,
      promotorComercial: _form.validarDatos.promotorComercial.numeroIdentificacion,
      mimTipoPlan: _form.cotizarProteccion.tipoPlan,
      codigoPlan: _form.cotizarProteccion.plan.codigo,
      mimPlan: _form.cotizarProteccion.plan,
      mimProyectoVida: _form.cotizarProteccion.cualProyectoVida.codigo === 0 ? null : _form.cotizarProteccion.cualProyectoVida,
      otroProyectoVida: _form.cotizarProteccion.cual,
      ingresosMensuales: _form.cotizarProteccion.ingresos,
      porcentajeValorCuota: +(_form.tipoCalculo.valorCuota / 100).toFixed(4),
      tipoCalculo: +_form.tipoCalculo.rdTipoCalculo,
      mimCotizacionDetalleSet: _form.tipoCalculo.mimCotizacionDetalleSet
    };

    let _mimCotizacion = null;
    let mensajeGuardar = null;
    if (this.esCrear) {
      _mimCotizacion = await this.backService.cotizacion.postCotizacion(this.datosForm).toPromise()
        .catch((err) => {
          this.bloquearBotonFinalizar = false;
          this.frontService.alert.warning(err.error.message);
          return;
        });
      mensajeGuardar = await this.translate.get('global.guardadoExitosoMensaje').toPromise();
    } else {
      this.datosForm.objectoProyeccion = null;
      _mimCotizacion = await this.backService.cotizacion.putCotizacion(this.codigoCotizacion, this.datosForm).toPromise()
        .catch((err) => {
          this.bloquearBotonFinalizar = false;
          this.frontService.alert.warning(err.error.message);
          return;
        });
      mensajeGuardar = await this.translate.get('global.actualizacionExitosaMensaje').toPromise();
    }

    if (_mimCotizacion) {
      this.frontService.alert.success(mensajeGuardar).then(() => {
        this.bloquearBotonFinalizar = false;
        this.form.reset();
        // Redireccionamos a la pantalla resumen contizacion (Proyección).
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS,
          _mimCotizacion.codigo
        ]);
      });
    }
  }

  private simular() {
    // Configuramos la edad en mimCotizacion.
    this.datosForm = { ...this.datosForm, edad: this.edadCotizacion };
    // Deshabilitamos los componentes que generan una simulación mientras se esta simulando..
    this.deshabilitarControlesSimular(true);
    this.bloquearBotonFinalizar = true;
    this.backService.cotizacion.postSimularCotizacion(this.datosForm).subscribe(mimCotizacion => {
      // Se habilitan nuevamente los componentes que generan una simulación.
      this.deshabilitarControlesSimular(false);
      this.bloquearBotonFinalizar = false;
      this.configurarMimCotizacion(mimCotizacion);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
      // Se habilitan nuevamente los componentes que generan una simulación.
      this.deshabilitarControlesSimular(false);
      this.bloquearBotonFinalizar = false;

      // Si y solo si ocurre un error y fue debido a una seleccion nueva de mimPlan debemos limpiar mimCotizacionDetalleSet
      if (this.datosForm.codigoPlan !== null && this.datosForm.codigoPlan !== undefined
        && this.datosFormCopy.codigoPlan !== null && this.datosFormCopy.codigoPlan !== undefined
        && this.datosForm.codigoPlan !== this.datosFormCopy.codigoPlan) {
        this.datosFormCopy.mimCotizacionDetalleSet = [];
      }

      this.configurarMimCotizacion(this.datosFormCopy);
    });
  }

  private deshabilitarControlesSimular(deshabilitar: boolean) {
    const _cotizarProteccion = this.form.controls.cotizarProteccion['controls'];
    const _tipoCalculo = this.form.controls.tipoCalculo['controls'];

    if (deshabilitar) {
      _cotizarProteccion.tipoPlan.disable({ emitEvent: false });
      _cotizarProteccion.plan.disable({ emitEvent: false });
      _cotizarProteccion.fondo.disable({ emitEvent: false });
      _cotizarProteccion.ingresos.disable({ emitEvent: false });
      _tipoCalculo.rdTipoCalculo.disable({ emitEvent: false });
      _tipoCalculo.valorCuota.disable({ emitEvent: false });
      _tipoCalculo.mimCotizacionDetalleSet.disable({ emitEvent: false });
    } else if (!this.esCrear) {
      _cotizarProteccion.ingresos.enable({ emitEvent: false });
      _tipoCalculo.rdTipoCalculo.enable({ emitEvent: false });
      _tipoCalculo.valorCuota.enable({ emitEvent: false });
      _tipoCalculo.mimCotizacionDetalleSet.enable({ emitEvent: false });
    } else {
      _cotizarProteccion.tipoPlan.enable({ emitEvent: false });
      _cotizarProteccion.plan.enable({ emitEvent: false });
      _cotizarProteccion.fondo.enable({ emitEvent: false });
      _cotizarProteccion.ingresos.enable({ emitEvent: false });
      _tipoCalculo.rdTipoCalculo.enable({ emitEvent: false });
      _tipoCalculo.valorCuota.enable({ emitEvent: false });
      _tipoCalculo.mimCotizacionDetalleSet.enable({ emitEvent: false });
    }
  }

  private configurarMimCotizacion(mimCotizacion: any) {
    // Sobre escribimos datosForm con lo que traiga mimCotizacion sin descartar otros atributos que contenga la estructura.
    this.datosForm = {
      ...this.datosForm,
      ...mimCotizacion
    };

    if (this.datosForm.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA) {
      this.datosForm.tipoCalculo = MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION;
    }

    if (this.datosForm.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION && !this.datosForm.porcentajeValorCuota) {
      this.form.controls.tipoCalculo['controls'].rdTipoCalculo.setValue(MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION.toString(), { emitEvent: false });
      this.datosForm.tipoCalculo = MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION;
    }

    // Configuramos la data de configuracion de componentes hijos.
    this.dataInitCotizar = {
      ...this.dataInitCotizar,
      rentaDiariaRecomendada: mimCotizacion.rentaDiaria
    };

    this.dataInitTipoCalculo = {
      ...this.dataInitTipoCalculo,
      mimCotizacion: mimCotizacion
    };

    // Actualizamos valores en el formulario de ser necesario.
    // IMPORTANTE: Cualquier setValue que se realice en este punto debe tener { emitEvent: false }.
    // Si no se coloca es posible que se generen bucles infinitos emitEvent impide que se ejecute la logica del valueChanges.
    this.form.controls.tipoCalculo['controls'].mimCotizacionDetalleSet
      .setValue(this.datosForm.mimCotizacionDetalleSet, { emitEvent: false });
    this.form.controls.tipoCalculo['controls'].valorCuota.setValue(+(this.datosForm.porcentajeValorCuota * 100).toFixed(4), { emitEvent: false });
  }

  private removerRepetidos(listaObj: any) {
    return [...new Set(listaObj.map(JSON.stringify))].map((x: any) => JSON.parse(x));
  }

  private configurarEdadCotizacion() {
    const nextBirthDate = DateUtil.nextBirthDayDate(DateUtil.stringToDate(this.datosAsociado.fecNac));
    const today = new Date();

    const daysBetween = DateUtil.obtenerDiasEntre({
      fechaInicio: today,
      fechaFin: nextBirthDate
    });

    if (0 <= daysBetween && daysBetween <= 30) {
      this.translate.get(
        'asociado.protecciones.portafolio.cotizacion.alertas.edadCotizacion',
        { fecha: DateUtil.dateToString(nextBirthDate, 'dd-MM-yyyy') }).subscribe(mensaje => {
          this.frontService.alert.info(mensaje).then(() => {
            this.edadCotizacion = this.datosAsociado.edad + 1;
          });
        });
    }

    this.edadCotizacion = this.datosAsociado.edad;
  }

  private fillCumulosList(items: any) {
    this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.cumulos').subscribe(mensajes => {
      this.sipVinculaciones.mimControlCumuloList.push(
        {
          acumulado: items.vinProteccionAcumulada,
          mimCumulo: { nombre: mensajes.muerte }
        },
        {
          acumulado: items.vinPerseveranciaAcumulada,
          mimCumulo: { nombre: mensajes.perseverancia }
        },
        {
          acumulado: items.vinRentaAcumulada,
          mimCumulo: { nombre: mensajes.rentaDiaria }
        },
        {
          acumulado: items.vinProteccionAcumuladaTotal,
          mimCumulo: { nombre: mensajes.proteccion }
        }
      );
    });
  }

  private async configurarDesplegables(mimCanal: any) {
    // Si existe un detalle del canal se obtienen los usuarios relacionados al canal
    if (mimCanal) {
      // Obtenemos las listas de los planes y tipo-plan
      this.fondos = [];
      this.planesAll = [];
      this.movimientoPlanCanal.map(mimMovimientoPlanCanal => {
        if (mimMovimientoPlanCanal.mimPlanCanalVenta.mimCanalVenta.codigo === mimCanal.codigo) {
          this.planesAll.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan);
          this.fondos.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan.mimFondo);
        }
      });
      this.fondos = this.removerRepetidos(this.fondos);
      this.fondos.sort((a, b) => b.nombre - a.nombre);

      this.tipoPlanes = this.removerRepetidos(this.tipoPlanes);
      this.tipoPlanes.sort((a, b) => b.nombre - a.nombre);

      this.promotoresComerciales = null;
      const _promotoresComerciales = await this.backService.promotor.getPromotores({ estado: true, 'mimPromotorCanalList.mimCanal.codigo': mimCanal.codigo }).toPromise().catch(err => {
        this.frontService.alert.warning(err.error.message);
      });
      this.promotoresComerciales = _promotoresComerciales.content;

      // Si existe un detalle del plan se consulta plan-cobertura
      if (this.datosForm.mimPlan) {
        const _planes = this.planesAll.filter(item => item.mimTipoPlan.codigo === this.datosForm.mimPlan.mimTipoPlan.codigo);
        this.planes = _planes.sort((a, b) => b.nombre - a.nombre);
      } else {
        this.planesAll = this.removerRepetidos(this.planesAll);
        this.dataInitCotizar = {
          ...this.dataInitCotizar,
          fondos: this.fondos,
          tipoPlanes: this.tipoPlanes,
          planes: null
        };
      }
    }
  }

  habilitarAgregarPlan(habilita?:boolean) {
    if(habilita){
      this.agregarPlan = true;
    }else{
      this.agregarPlan = !this.agregarPlan;
    }

    if (this.agregarPlan) {
      this.infoPlan = false;
    }
  }

  procesarEvento(event: boolean) {
    this.infoPlan = event;
    this.agregarPlan = false;
  }

  procesarEliminacioPlan(event: boolean){
    this.infoPlan = event;
    this.agregarPlan = event;
  }
}
