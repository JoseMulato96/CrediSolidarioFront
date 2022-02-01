import { Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { FileUtils } from '@shared/util/file.util';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import * as acciones from '../portafolio.actions';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';

@Component({
  selector: 'app-venta-plan',
  templateUrl: './venta-plan.component.html',
  styleUrls: ['./venta-plan.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VentaPlanComponent),
      multi: true
    }
  ]
})
export class VentaPlanComponent extends FormValidate implements OnInit, OnDestroy {

  asoNumInt = '';
  subs: Subscription[] = [];

  activeIndex = 0;
  items: MenuItem[];

  form: FormGroup;
  isForm: Promise<any>;
  codigoCotizacion: string;
  codigoPromotorComercial: string;
  codigoProceso: string;
  codigoTarea: string;

  precargaLista: boolean;
  canalVentas: any[];
  fondos: any;
  fondosAll: any;
  tipoPlanes: any;
  planes: any;
  planesAll: any;
  cualProyectoVida: any;
  promotoresComerciales: any[];
  porcentajeCuota: any;
  declaracionSalud: any;
  planCoberturas: any[];
  movimientoPlanCanal: any;

  datosAsociado: any;
  sipVinculaciones: any;
  salarioMinimo: any;

  datosForm: any;
  datosFormCopy: any;
  dataInitValidar: any;
  dataInitCotizar: any;
  dataInitTipoCalculo: any;
  dataInitDeclaracionSalud: any;

  mostrarAmpliarRespuesta1: boolean;
  mostrarAmpliarRespuesta2: boolean;
  textoAmpliarRespuesta1: string;
  textoAmpliarRespuesta2: string;
  sipParametros: any;
  imc: number;

  mostrarFinalizar: boolean;
  edadCotizacion: number;
  bloquearBotonFinalizar: boolean;
  bloquearFechaSolicitud: boolean;
  vieneDeCotizacion: boolean;
  vieneDeFlujo: boolean;

  mostrarModalDescargarFormatoVenta: boolean;
  formatoVentaDescargado: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.precargaLista = false;
    this.canalVentas = [];
    this.promotoresComerciales = [];
    this.planCoberturas = [];
    this.imc = 0;
    this.bloquearFechaSolicitud = false;
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

    this.subs.push(
      this.route.params.subscribe((params: any) => {
        this.codigoCotizacion = params.codigo;
        this.codigoProceso = params.processInstanceId;
        this.codigoTarea = params.taskId;

        // Nos aseguramos de obtener los datos solo despues de intentar obtener el codigoCotizacion.
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
      })
    );

    this.items = [{
      label: 'Validar datos',
      id: '0',
      command: (event: any) => {
        this.activeIndex = 0;
        this.mostrarBotonFinalizar();
      }
    },
    {
      label: 'Registrar protección',
      id: '1',
      command: async (event: any) => {
        if (!this.precargaLista) {
          return;
        }

        this.continuar(1);
        this.mostrarBotonFinalizar();
      }
    }
    ];
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach(x => x.unsubscribe());
  }

  private initForm(param?: any) {
    const codigoTipoPlan = param ?
      param.mimTipoPlan ?
        param.mimTipoPlan.codigo
        : param.mimPlan ?
          param.mimPlan.mimTipoPlan.codigo
          : null
      : null;
    const codigoFondo = param ?
      param.mimFondo ?
        param.mimFondo.codigo
        : param.mimPlan ?
          param.mimPlan.mimFondo.codigo
          : null
      : null;

    this.codigoPromotorComercial = param && param.promotorComercial ? param.promotorComercial : null;

    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        validarDatos: this.formBuilder.group({
          fechaSolicitud: [param ? param.fechaSolicitud : null, [Validators.required]],
          fechaNacimiento: [param ? param.fechaNacimiento : null],
          mail: [param ? param.correoElectronico : null, [Validators.required, Validators.minLength(3), Validators.email]],
          canalVenta: [param && param.mimCanal ? this.obtenerMimCanal(param.mimCanal.codigo) : null, [Validators.required]],
          promotorComercial: [param ? this.obtenerPromotorComercial(param.promotorComercial) : null, [Validators.required]],
          aceptaTratamientoDatosPersonales: [null, [Validators.required]]
        }),
        cotizarProteccion: this.formBuilder.group({
          fondo: [param ? this.obtenerMimFondo(codigoFondo) : null, [Validators.required]],
          tipoPlan: [param ? this.obtenerMimTipoPlan(codigoTipoPlan) : null, [Validators.required]],
          plan: [param ? this.obtenerMimPlan(param.codigoPlan) : null, [Validators.required]],
          cualProyectoVida: [param && param.mimProyectoVida ?
            this.obtenerMimProyectoVida(param.mimProyectoVida.codigo)
            : null, [Validators.required]],
          cual: [param ? param.otroProyectoVida : null],
          ingresos: [param ? param.ingresosMensuales : null, [Validators.required]]
        }),
        tipoCalculo: this.formBuilder.group({
          rdTipoCalculo: [param ? String(param.tipoCalculo) : null],
          valorCuota: [param ? +(param.porcentajeValorCuota * 100).toFixed(4) : null, { updateOn: 'blur' }],
          mimCotizacionDetalleSet: [param ? param.mimCotizacionDetalleSet : [], [Validators.required]]
        }),
        declaracionSalud: this.formBuilder.group({
          preguntasControlMedico: new FormArray([]),
          diagnostico: [param ? param.diagnostico : null],
          fechaDiagnostico: [param ? param.fechaDiagnostico : null],
          descripcionSecuela: [param ? param.descripcionSecuela : null],
          observacionDeclaracionSalud: [param ? param.observacionDeclaracionSalud : null],
          peso: [param ? param.peso : null, [Validators.required]],
          estatura: [param ? param.estatura : null, [Validators.required]]
        })
      })
    );
    this.form.controls.validarDatos['controls'].fechaNacimiento.disable();
    if (param.otroProyectoVida) {
      this.form.controls.cotizarProteccion['controls'].cualProyectoVida.setValue(this.obtenerMimProyectoVida(0));
    } else {
      this.form.controls.cotizarProteccion['controls'].cual.disable();
    }

    this.declaracionSalud.forEach(element => {
      this.addPreguntas(element);
    });
    this.changevalidarDatos();
    this.changeCotizarProteccion();
    this.changeTipoCalculo();
    this.changeDeclaracionSalud();
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

  precargarDatos() {
    this.mostrarAmpliarRespuesta1 = false;
    this.mostrarAmpliarRespuesta2 = false;

    this.datosForm = {
      asoNumInt: this.asoNumInt,
      fechaSolicitud: DateUtil.dateToString(new Date(), 'dd-MM-yyyy'),
      fechaNacimiento: this.datosAsociado.fecNac,
      tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
      mimEstadoVenta: {
        codigo: MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE
      },
      mimTipoMovimiento: { codigo: MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.INCREMENTO }
    };

    let consultas = {
      _sipVinculaciones: this.backService.vinculacion.getSipVinculaciones({ asoNumInt: this.asoNumInt }),
      _movimientoPlanCanal: this.backService.movimientoPlanCanal.getMimMovimientoPlanCanal(
        {
          'mimTipoMovimiento.codigo': MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.INCREMENTO,
          fechaVigencia: DateUtil.dateToString(new Date(), 'dd-MM-yyyy'),
          'mimPlanCanalVenta.mimPlan.mimPlanNivelRiesgoList.mimPlanNivelRiesgoPK.codigoNivelRiesgo': this.datosAsociado.nivelRiesgo,
          edadIngresoPlan: this.edadCotizacion,
          'mimPlanCanalVenta.mimPlan.mimEstadoPlan.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO
        }),
      _proyectosVida: this.backService.proyectoVida.getProyectosVida({ estado: true }),
      _salarioMinimo: this.backService.asociado.getSalarioMinimo(new Date(), new Date()),
      _mimPreguntas: this.backService.preguntas.getMimPreguntas({ sort: 'orden,asc' }),
      _sipParametros: this.backService.parametro.getParametrosTipo(SIP_PARAMETROS_TIPO.CONFIGURACION_PROCESO_VENTA_INCREMENTO.TIP_COD)
    } as any;

    // Definimos dos booleanos.
    this.vieneDeCotizacion = this.codigoCotizacion !== null && this.codigoCotizacion !== undefined;
    this.vieneDeFlujo = this.codigoProceso !== undefined && this.codigoProceso !== null && this.codigoTarea !== undefined && this.codigoTarea !== null;

    if (this.vieneDeCotizacion) {
      consultas = {
        ...consultas,
        _mimCotizacion: this.backService.cotizacion.getCotizacion(this.codigoCotizacion)
      };
      forkJoin(consultas).subscribe(async (respuesta: any) => {
        this.salarioMinimo = respuesta._salarioMinimo;

        let mensajes = [];
        const mensajeSipVinculaciones = await this.configurarSipVinculaciones(respuesta._sipVinculaciones.content[0]);
        mensajes.push(mensajeSipVinculaciones);
        const mensajeMimMovimientoPlanCanal = await this.configurarMimMovimientoPlanCanal(respuesta._movimientoPlanCanal.content);
        mensajes.push(mensajeMimMovimientoPlanCanal);

        mensajes = mensajes.filter(mensaje => mensaje !== null && mensaje !== undefined && mensaje !== '');
        if (mensajes.length !== 0) {
          this.frontService.alert.info(mensajes.join(' <br /> <br /> '));
        }

        this.sipParametros = respuesta._sipParametros.sipParametrosList;

        this.configurarMimCanalVenta();

        this.configurarMimProyectoVida(respuesta._proyectosVida.content);

        await this.configurarMimPorcentajeCuota(this.sipVinculaciones.sipVinculacionesClasificacion.sipVinculacionesTipo.vinCod);

        this.declaracionSalud = respuesta._mimPreguntas._embedded.mimPreguntas;

        const mimCotizacion = respuesta._mimCotizacion;
        mimCotizacion.mimCotizacionDetalleSet = mimCotizacion.mimCotizacionDetalleSet.filter(mimCotizacionDetalle => mimCotizacionDetalle.cuota !== 0 && mimCotizacionDetalle.valorProteccion !== 0);

        // Antes de mapear la cotizacion en la venta creamos una copia del objeto para relacionarlo con la venta como tal.
        const mimCotizacionCopia = JSON.parse(JSON.stringify(mimCotizacion));
        this.datosForm = {
          ...this.datosForm,
          ...mimCotizacion,
          mimCotizacion: mimCotizacionCopia,
          mimTipoMovimiento: { codigo: MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.INCREMENTO }
        };

        await this.configurarDesplegables();

        this.initForm(this.datosForm);

        // Para que no recalcule las coberturas
        this.datosForm = {
          ...this.datosForm,
          variablesSimular: { configurarCoberturas: false }
        };

        this.simular();

        this.configurarDataInitComponentes();

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

    } else if (this.vieneDeFlujo) {
      consultas = {
        ...consultas,
        _mimVenta: this.backService.venta.getVenta({ idProceso: this.codigoProceso }),
        _tarea: this.backService.proceso.getTareasPorIdProceso(this.codigoProceso, { includeProcessVariables: true })
      };

      forkJoin(consultas).subscribe(async (respuesta: any) => {
        if (!respuesta._mimVenta.content[0]) {
          this.translate.get('asociado.protecciones.portafolio.resumen.alertas.noEncontroVenta').subscribe(mensaje => {
            this.frontService.alert.info(mensaje).then(() => {
              this.router.navigate([UrlRoute.PAGES]);
            });
          });
        }

        this.salarioMinimo = respuesta._salarioMinimo;

        let mensajes = [];
        const mensajeSipVinculaciones = await this.configurarSipVinculaciones(respuesta._sipVinculaciones.content[0]);
        mensajes.push(mensajeSipVinculaciones);
        const _movimiestosPlanCanales = respuesta._movimientoPlanCanal.content.filter(x =>
          x.mimPlanCanalVenta.mimPlan.codigo === respuesta._mimVenta.content[0].mimPlan.codigo &&
          x.mimPlanCanalVenta.mimPlan.mimFondo.codigo === respuesta._mimVenta.content[0].mimPlan.mimFondo.codigo &&
          x.mimPlanCanalVenta.mimPlan.mimTipoPlan.codigo === respuesta._mimVenta.content[0].mimPlan.mimTipoPlan.codigo);
        const mensajeMimMovimientoPlanCanal = await this.configurarMimMovimientoPlanCanal(_movimiestosPlanCanales);
        mensajes.push(mensajeMimMovimientoPlanCanal);

        mensajes = mensajes.filter(mensaje => mensaje !== null && mensaje !== undefined && mensaje !== '');
        if (mensajes.length !== 0) {
          this.frontService.alert.info(mensajes.join(' <br /> <br /> '));
        }

        this.sipParametros = respuesta._sipParametros.sipParametrosList;

        this.configurarMimCanalVenta();

        this.configurarMimProyectoVida(respuesta._proyectosVida.content);

        await this.configurarMimPorcentajeCuota(this.sipVinculaciones.sipVinculacionesClasificacion.sipVinculacionesTipo.vinCod);

        this.declaracionSalud = respuesta._mimPreguntas._embedded.mimPreguntas;

        const mimVenta = respuesta._mimVenta.content[0];
        const mimCotizacionDetalleSet = mimVenta.sipProteccionesEventosSet.map(sipProteccionesEventos => {
          return this.transformarSipProteccionesEventosAMimCotizacionDetalle(sipProteccionesEventos);
        });
        mimVenta.mimCotizacionDetalleSet = mimCotizacionDetalleSet.filter(mimCotizacionDetalle => mimCotizacionDetalle.cuota !== 0 && mimCotizacionDetalle.valorProteccion !== 0);

        const tarea = respuesta._tarea[0];

        this.datosForm = {
          ...this.datosForm,
          ...mimVenta
        };

        // Configuramos las respuestas a las preguntas provenientes de mimVenta en la estructura declaracionSalud
        this.declaracionSalud.map(mimPreguntas => {
          const mimPreguntasVenta = this.datosForm.mimVentasPreguntasList.find(preguntasVenta => preguntasVenta.mimPreguntas.codigo === mimPreguntas.codigo);
          if (mimPreguntasVenta) {
            mimPreguntas.respuesta = mimPreguntasVenta.respuesta;
          }
        });

        // Si alguna de las preguntas tiene como respuesta true se debe mostrar el formulario de IMC.
        if (this.declaracionSalud && this.declaracionSalud.find(mimPreguntas => mimPreguntas.respuesta &&
          (mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_1
            || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_2
            || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_3
            || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_4
          ))
        ) {
          this.mostrarAmpliarRespuesta1 = true;
        }

        if (this.declaracionSalud && this.declaracionSalud.find(mimPreguntas => mimPreguntas.respuesta &&
          (mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_5
            || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_6
            || mimPreguntas.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_7
          ))
        ) {
          this.mostrarAmpliarRespuesta2 = true;
        }

        // Configuramos el IMC
        this.imc = this.datosForm.imc !== null && this.datosForm.imc !== undefined ? this.datosForm.imc : 0;

        // Se configura la pestaña de Declaración de salud
        this.configurarDeclaracionSalud();

        await this.configurarDesplegables();

        this.initForm(this.datosForm);
        this.bloquearFechaSolicitud = true;
        // Para que no recalcule las coberturas
        this.datosForm = {
          ...this.datosForm,
          variablesSimular: { configurarCoberturas: false }
        };

        this.simular();

        this.configurarDataInitComponentes();

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

    } else {
      // Si no viene de cotización, ni de una devolución en el flujo.
      forkJoin(consultas).subscribe(async (respuesta: any) => {
        this.salarioMinimo = respuesta._salarioMinimo;

        let mensajes = [];
        const mensajeSipVinculaciones = await this.configurarSipVinculaciones(respuesta._sipVinculaciones.content[0]);
        mensajes.push(mensajeSipVinculaciones);
        const mensajeMimMovimientoPlanCanal = await this.configurarMimMovimientoPlanCanal(respuesta._movimientoPlanCanal.content);
        mensajes.push(mensajeMimMovimientoPlanCanal);

        mensajes = mensajes.filter(mensaje => mensaje !== null && mensaje !== undefined && mensaje !== '');
        if (mensajes.length !== 0) {
          this.frontService.alert.info(mensajes.join(' <br /> <br /> '));
        }

        this.sipParametros = respuesta._sipParametros.sipParametrosList;

        this.configurarMimCanalVenta();

        this.configurarMimProyectoVida(respuesta._proyectosVida.content);

        await this.configurarMimPorcentajeCuota(this.sipVinculaciones.sipVinculacionesClasificacion.sipVinculacionesTipo.vinCod);

        this.declaracionSalud = respuesta._mimPreguntas._embedded.mimPreguntas;

        await this.configurarDesplegables();

        this.initForm(this.datosForm);

        this.configurarDataInitComponentes();

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

    _validaDatos.canalVenta.valueChanges.subscribe(mimCanalVenta => {
      if (mimCanalVenta === null || mimCanalVenta === undefined) {
        return;
      }

      _validaDatos.promotorComercial.setValue(null);
      if (!this.vieneDeFlujo) {
        _cotizarProteccion.fondo.setValue(null, { emitEvent: false });
        _cotizarProteccion.tipoPlan.setValue(null, { emitEvent: false });
        _cotizarProteccion.plan.setValue(null, { emitEvent: false });

        this.fondos = [];
        this.fondosAll = [];
        this.planesAll = [];
        this.tipoPlanes = [];
        this.planes = null;
        this.movimientoPlanCanal.map(mimMovimientoPlanCanal => {
          if (mimMovimientoPlanCanal.mimPlanCanalVenta.mimCanalVenta.codigo === mimCanalVenta.codigo) {
            this.planesAll.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan);
            this.tipoPlanes.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan.mimTipoPlan);
            this.fondos.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan.mimFondo);
          }
        });
        this.planesAll = this.removerRepetidos(this.planesAll);
        this.tipoPlanes = this.removerRepetidos(this.tipoPlanes);
        this.tipoPlanes.sort((a, b) => b.nombre - a.nombre);
        this.fondos = this.removerRepetidos(this.fondos);
        this.fondos.sort((a, b) => b.nombre - a.nombre);
        this.dataInitCotizar = {
          ...this.dataInitCotizar,
          fondos: this.fondos,
          tipoPlanes: null, // this.tipoPlanes,
          planes: null
        };
      }

      this.promotoresComerciales = [];
      this.backService.promotor.getPromotores({ estado: true }).subscribe(respuesta => {
        this.promotoresComerciales = respuesta._embedded.mimPromotor;
        this.dataInitValidar = {
          ...this.dataInitValidar,
          promotoresComerciales: this.promotoresComerciales
        };
      });
    });
  }

  private changeCotizarProteccion() {
    const _cotizarProteccion = this.form.controls.cotizarProteccion['controls'];

    _cotizarProteccion.cualProyectoVida.valueChanges.subscribe(mimProyectoVida => {
      if (mimProyectoVida === null || mimProyectoVida === undefined) {
        return;
      }
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
      this.tipoPlanes = this.planesAll.filter(item => item.mimFondo.codigo === mimFondo.codigo).map(planes => planes.mimTipoPlan);
      this.tipoPlanes.sort((a, b) => b.nombre - a.nombre);
      this.dataInitCotizar = {
        ...this.dataInitCotizar,
        tipoPlanes: this.tipoPlanes
      };
      this.datosForm = {
        ...this.datosForm,
        mimFondo: mimFondo,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      // Siempre que ocurre un cambio en mimTipoPlan o mimPlan debemos restaurar tipoCalculo.
      this.initTipoCalculoForm(this.datosForm);
      // Además para fondo se debe limpiar tipoPlan y mimPlan.
      this.form.get('cotizarProteccion')['controls'].plan.setValue(null, { emitEvent: false });
      this.form.get('cotizarProteccion')['controls'].tipoPlan.setValue(null, { emitEvent: false });
    });

    _cotizarProteccion.tipoPlan.valueChanges.subscribe(mimTipoPlan => {
      if (mimTipoPlan === null || mimTipoPlan === undefined) {
        return;
      }
      const _codigoFondo = _cotizarProteccion.fondo.value.codigo;
      // Copnsultamos mimPlanSet para mimTipoPlan seleccionado.
      const _planes = this.planesAll.filter(item => item.mimTipoPlan.codigo === mimTipoPlan.codigo && item.mimFondo.codigo === _codigoFondo);
      this.planes = _planes.sort((a, b) => b.nombre - a.nombre);
      this.dataInitCotizar = {
        ...this.dataInitCotizar,
        planes: this.planes
      };
      this.datosForm = {
        ...this.datosForm,
        mimTipoPlan: mimTipoPlan,
        tipoCalculo: MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION,
        porcentajeValorCuota: null,
        mimCotizacionDetalleSet: []
      };
      // Siempre que ocurre un cambio en mimTipoPlan o mimPlan debemos restaurar tipoCalculo.
      this.initTipoCalculoForm(this.datosForm);
      // Adem;ás para tipo plan se debe limpiar mimPlan.
      this.form.get('cotizarProteccion')['controls'].plan.setValue(null, { emitEvent: false });
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
      if (!this.porcentajeCuota && +tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION) {
        this.translate.get('asociado.protecciones.portafolio.venta.alertas.noHayPorcentajeConfigurado', { codigo: this.datosAsociado.claVin }).subscribe(mensaje => {
          this.frontService.alert.info(mensaje).then(() => {
            _tipoCalculo.rdTipoCalculo.setValue(MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION.toString(), { emitEvent: false });
            this.datosForm.tipoCalculo = MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_PROTECCION;
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
      const porcentajeValorCuota = +(valorCuota / 100).toFixed(4);
      this.datosForm = {
        ...this.datosForm,
        porcentajeValorCuota: porcentajeValorCuota
      };
      this.datosFormCopy = JSON.parse(JSON.stringify(this.datosForm));
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

  private changeDeclaracionSalud() {
    const _declaracionSalud = this.form.controls.declaracionSalud['controls'];
    _declaracionSalud.preguntasControlMedico.valueChanges.subscribe(resp => {
      let mostrarAmpliarRespuesta1 = false;
      let mostrarAmpliarRespuesta2 = false;
      if (resp.find(x => x.respuesta)) {
        _declaracionSalud.observacionDeclaracionSalud.setValidators([Validators.required]);

        if (resp.find(x => x.respuesta && (x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_1
          || x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_2
          || x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_3
          || x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_4
        ))) {
          _declaracionSalud.diagnostico.setValidators([Validators.required]);
          _declaracionSalud.fechaDiagnostico.setValidators([Validators.required]);
          _declaracionSalud.descripcionSecuela.setValidators([Validators.required]);
          mostrarAmpliarRespuesta1 = true;
          this.textoAmpliarRespuesta1 = this.sipParametros.find(x => x.sipParametrosPK.codigo === 4).nombre;
        } else {
          this.textoAmpliarRespuesta1 = null;
        }

        if (resp.find(x => x.respuesta && (x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_5
          || x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_6
          || x.codigo === SIP_PARAMETROS_TIPO.SIP_PREGUNTAS.PREGUNTA_7
        ))) {
          mostrarAmpliarRespuesta2 = true;
          this.textoAmpliarRespuesta2 = this.sipParametros.find(x => x.sipParametrosPK.codigo === 5).nombre;
        } else {
          this.textoAmpliarRespuesta2 = null;
        }
      } else {
        _declaracionSalud.diagnostico.setValidators(null);
        _declaracionSalud.fechaDiagnostico.setValidators(null);
        _declaracionSalud.descripcionSecuela.setValidators(null);
        _declaracionSalud.peso.setValidators(null);
        _declaracionSalud.estatura.setValidators(null);
        _declaracionSalud.observacionDeclaracionSalud.setValidators(null);

        _declaracionSalud.diagnostico.setValue(null);
        _declaracionSalud.fechaDiagnostico.setValue(null);
        _declaracionSalud.descripcionSecuela.setValue(null);
        _declaracionSalud.peso.setValue(null);
        _declaracionSalud.estatura.setValue(null);
        _declaracionSalud.observacionDeclaracionSalud.setValue(null);

        this.textoAmpliarRespuesta1 = null;
        this.textoAmpliarRespuesta2 = null;
      }
      this.dataInitDeclaracionSalud = {
        ...this.dataInitDeclaracionSalud,
        mostrarAmpliarRespuesta1,
        mostrarAmpliarRespuesta2,
        textoAmpliarRespuesta1: this.textoAmpliarRespuesta1,
        textoAmpliarRespuesta2: this.textoAmpliarRespuesta2,
        deshabilitaFechaDiag: false
      };
    });

    _declaracionSalud.peso.valueChanges.subscribe(resp => {
      this.imc = 0;
      if (_declaracionSalud.estatura.value) {
        const estatura = _declaracionSalud.estatura.value.toString().includes(',') ? _declaracionSalud.estatura.value.toString().replace(',', '.') : _declaracionSalud.estatura.value;
        this.imc = +resp / Math.pow(+estatura, 2);
      }
      this.dataInitDeclaracionSalud = {
        ...this.dataInitDeclaracionSalud,
        imc: this.imc
      };
    });

    _declaracionSalud.estatura.valueChanges.subscribe(resp => {
      this.imc = 0;
      if (_declaracionSalud.peso.value) {
        resp = resp.includes(',') ? resp.replace(',', '.') : resp;
        this.imc = +_declaracionSalud.peso.value / Math.pow(+resp, 2);
      }
      this.dataInitDeclaracionSalud = {
        ...this.dataInitDeclaracionSalud,
        imc: this.imc
      };
    });
  }

  private obtenerMimCanal(codigo: any): any {
    return this.canalVentas ? this.canalVentas.find(mimCanal => mimCanal.codigo === codigo) : null;
  }

  private obtenerPromotorComercial(identificacion: any): any {
    return this.promotoresComerciales ? this.promotoresComerciales.find(promotorComercial => promotorComercial.numeroIdentificacion === +identificacion) : null;
  }

  private obtenerMimPlan(codigo: any): any {
    return this.planes ? this.planes.find(mimPlan => mimPlan.codigo === codigo) : null;
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

  private async validDatos() {
    if (this.form.controls.validarDatos.invalid) {
      this.validateForm(this.form.controls.validarDatos as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }
    const _form = this.form.getRawValue();

    this.datosForm = {
      ...this.datosForm,
      fechaSolicitud: _form.validarDatos.fechaSolicitud,
      correoElectronico: _form.validarDatos.mail,
      mimCanal: _form.validarDatos.canalVenta,
      promotorComercial: _form.validarDatos.promotorComercial.numeroIdentificacion,
      aceptaTratamientoDatosPersonales: _form.validarDatos.aceptaTratamientoDatosPersonales === '1' ? true : false
    };

    if (_form.validarDatos.aceptaTratamientoDatosPersonales === '2') {
      const _mensaje = await this.translate.get('shared.components.form.validarDatos.alertas.noAutorizaTratamientoDatos').toPromise();
      return await this.frontService.alert.confirm(_mensaje);
    } else {
      return true;
    }
  }

  private validRegistroProteccion(): boolean {
    if (this.form.controls.cotizarProteccion.invalid || this.form.controls.tipoCalculo.invalid) {
      this.validateForm(this.form.controls.cotizarProteccion as FormGroup);
      this.validateForm(this.form.controls.tipoCalculo as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }

    const _form = this.form.getRawValue();
    this.datosForm = {
      ...this.datosForm,
      fechaSolicitud: _form.validarDatos.fechaSolicitud,
      correoElectronico: _form.validarDatos.mail,
      mimCanal: _form.validarDatos.canalVenta,
      promotorComercial: _form.validarDatos.promotorComercial.numeroIdentificacion,
      aceptaTratamientoDatosPersonales: _form.validarDatos.aceptaTratamientoDatosPersonales === '1' ? true : false,
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
    return true;
  }

  private validDeclaracionSalud(): boolean {
    if (this.form.invalid) {
      this.validateForm(this.form as FormGroup);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return false;
    }

    const _declaracionSalud = this.form.controls.declaracionSalud['controls'];
    const _mimVentasPreguntasList = [];

    _declaracionSalud.preguntasControlMedico.controls.forEach(element => {
      _mimVentasPreguntasList.push({
        mimVentasPreguntasPK: {
          codigoPregunta: element.value.codigo,
          codigoVenta: this.vieneDeFlujo ? this.datosForm.codigo : null
        },
        respuesta: element.value.respuesta,
        mimPreguntas: element.value
      });
    });
    this.datosForm = {
      ...this.datosForm,
      diagnostico: _declaracionSalud.diagnostico.value,
      fechaDiagnostico: _declaracionSalud.fechaDiagnostico.value,
      descripcionSecuela: _declaracionSalud.descripcionSecuela.value,
      observacionDeclaracionSalud: _declaracionSalud.observacionDeclaracionSalud.value,
      peso: _declaracionSalud.peso.value,
      estatura: +(_declaracionSalud.estatura.value && _declaracionSalud.estatura.value.toString().includes(',') ?
        _declaracionSalud.estatura.value.replace(',', '.') : _declaracionSalud.estatura.value),
      imc: +this.imc.toFixed(4),
      mimVentasPreguntasList: _mimVentasPreguntasList,
    };
    return true;
  }

  async continuar(activeIndex?: number) {
    if (this.activeIndex === 0 && !(await this.validDatos())) {
      return;
    }

    if ((this.activeIndex === 1 || (activeIndex && activeIndex > 1)) && !this.validRegistroProteccion()) {
      this.activeIndex = 1;
      return;
    }
    this.activeIndex = activeIndex ? activeIndex : this.activeIndex + 1;
    this.mostrarBotonFinalizar();
  }

  regresar() {
    this.activeIndex -= 1;
    this.mostrarBotonFinalizar();
  }

  public guardar() {
    // NOTA: No debemos llenar campos de la venta en este metodo, se deben llenar en finalizar().
    // Es decir, no debemos cambiar o asignar valores a this.datosForm.
    // Cerramos el modal de descargar formato de venta.
    this.mostrarModalDescargarFormatoVenta = false;
    // Bloqueamos el boton finalizar.
    this.bloquearBotonFinalizar = true;
    // Si no son nulos ni undefined el codigoProceso y codigoTarea se debe realizar una actualizacion de la venta.
    if (this.codigoProceso && this.codigoTarea) {
      this.backService.venta.postVentaActualizar(this.datosForm).subscribe(mimCotizacion => {
        this.frontService.alert.success(mimCotizacion.message).then(() => {
          this.bloquearBotonFinalizar = false;
          this.form.reset();
          this.irResumenCoberturasVenta(mimCotizacion.idProceso);
        });
      }, (err) => {
        this.bloquearBotonFinalizar = false;
        this.frontService.alert.warning(err.error.message);
      });
    } else {
      this.backService.venta.postVenta(this.datosForm).subscribe(mimCotizacion => {
        this.frontService.alert.success(mimCotizacion.message).then(() => {
          this.bloquearBotonFinalizar = false;
          this.form.reset();
          this.irResumenCoberturasVenta(mimCotizacion.idProceso);
        });
      }, (err) => {
        this.bloquearBotonFinalizar = false;
        this.frontService.alert.warning(err.error.message);
      });
    }

  }

  finalizar() {
    if (this.activeIndex === 1 && !this.validRegistroProteccion()) {
      return;
    }

    if (this.activeIndex === 2 && !this.validDeclaracionSalud()) {
      return;
    }

    // NOTA: Dado que para guardar una venta se necesita generar el formato de venta y el formato de venta
    // necesita a venta como tal, debemos asegurarnos de setear los campos faltantes. Estos campos no se
    // pueden configurar en el metodo guardar().
    const sipProteccionesEventosSet = this.datosForm.mimCotizacionDetalleSet.map(mimCotizacionDetalle => {
      return this.transformarMimCotizacionDetalleASipProteccionesEventos(mimCotizacionDetalle);
    });

    this.datosForm = {
      ...this.datosForm,
      codigo: this.vieneDeFlujo ? this.datosForm.codigo : null,
      sipProteccionesEventosSet: sipProteccionesEventosSet,
      variables: { requiereAuditoriaMedica: this.datosForm.requiereAuditoriaMedica }
    };

    this.mostrarModalDescargarFormatoVenta = true;
  }

  public descargarFormatoVenta() {
    // TODO(alobaton): Se comenta debido a que se esta presentando error en el servidor de QA
    this.formatoVentaDescargado = false;

    const fileName = 'FormatoVenta_' + DateUtil.dateToString(new Date(), 'dd-MM-yyyy');
    this.backService.venta.postGenerarFormatoVenta({ fileName: fileName }, this.datosForm)
      .subscribe(pdf => {
        const body: any = pdf.body;
        FileUtils.downloadPdfFile(body, fileName);
        this.formatoVentaDescargado = true;
      }, err => {
        this.frontService.alert.error(err.error.message);
      });

  }

  private simular() {
    this.datosForm = { ...this.datosForm, edad: this.edadCotizacion };
    // Deshabilitamos los componentes que generan una simulación mientras se esta simulando..
    this.deshabilitarControlesSimular(true);
    this.bloquearBotonFinalizar = true;
    this.backService.cotizacion.postSimularCotizacion(this.datosForm).subscribe(mimCotizacion => {
      // Se habilitan nuevamente los componentes que generan una simulación.
      this.deshabilitarControlesSimular(false);
      this.bloquearBotonFinalizar = false;
      this.configurarMimCotizacion(mimCotizacion);
      // Se configura la pestaña de Declaración de salud
      this.configurarDeclaracionSalud();
    }, (err) => {
      // Se habilitan nuevamente los componentes que generan una simulación.
      this.deshabilitarControlesSimular(false);
      this.bloquearBotonFinalizar = false;
      this.frontService.alert.warning(err.error.message);
      this.configurarMimCotizacion(this.datosFormCopy);
    });
  }

  private configurarDeclaracionSalud() {
    if (this.datosForm && this.datosForm.mostrarDeclaracionMedica && !this.items.find(item => item.id === '2')) {
      this.items.push({
        label: 'Declaración de salud',
        id: '2',
        command: async (event: any) => {
          if (!this.precargaLista) {
            return;
          }
          this.continuar(2);
        }
      });
    } else {
      if (!(this.datosForm && this.datosForm.mostrarDeclaracionMedica)) {
        this.items = this.items.filter(item => item.id !== '2');
      }
    }
    this.mostrarBotonFinalizar();
  }

  private deshabilitarControlesSimular(deshabilitar: boolean) {
    const _cotizarProteccion = this.form.controls.cotizarProteccion['controls'];
    const _tipoCalculo = this.form.controls.tipoCalculo['controls'];

    if (deshabilitar) {
      _cotizarProteccion.fondo.disable({ emitEvent: false });
      _cotizarProteccion.tipoPlan.disable({ emitEvent: false });
      _cotizarProteccion.plan.disable({ emitEvent: false });
      _cotizarProteccion.ingresos.disable({ emitEvent: false });
      _tipoCalculo.rdTipoCalculo.disable({ emitEvent: false });
      _tipoCalculo.valorCuota.disable({ emitEvent: false });
      _tipoCalculo.mimCotizacionDetalleSet.disable({ emitEvent: false });
    } else if (this.vieneDeFlujo) {
      _cotizarProteccion.ingresos.enable({ emitEvent: false });
      _tipoCalculo.rdTipoCalculo.enable({ emitEvent: false });
      _tipoCalculo.valorCuota.enable({ emitEvent: false });
      _tipoCalculo.mimCotizacionDetalleSet.enable({ emitEvent: false });
    } else {
      _cotizarProteccion.fondo.enable({ emitEvent: false });
      _cotizarProteccion.tipoPlan.enable({ emitEvent: false });
      _cotizarProteccion.plan.enable({ emitEvent: false });
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

    if (this.datosForm.tipoCalculo === MIM_PARAMETROS.MIM_COTIZACION_TIPO_CALCULO.VALOR_CUOTA_PROTECCION && (!this.datosForm.porcentajeValorCuota || !this.datosForm.ingresosMensuales)) {
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

    // Se restablese las propiedades normales del simular
    this.datosForm = {
      ...this.datosForm,
      variablesSimular: null
    };

    // Actualizamos valores en el formulario de ser necesario.
    // IMPORTANTE: Cualquier setValue que se realice en este punto debe tener { emitEvent: false }.
    // Si no se coloca es posible que se generen bucles infinitos emitEvent impide que se ejecute la logica del valueChanges.
    this.form.controls.tipoCalculo['controls'].mimCotizacionDetalleSet
      .setValue(this.datosForm.mimCotizacionDetalleSet, { emitEvent: false });
    this.form.controls.tipoCalculo['controls'].valorCuota.setValue(+(this.datosForm.porcentajeValorCuota * 100).toFixed(4), { emitEvent: false });
  }

  submit() {
    // do nothing
  }

  addPreguntas(pregunta: any) {
    const _declaracionSalud = this.form.controls.declaracionSalud['controls'];
    _declaracionSalud.preguntasControlMedico.push(this.formBuilder.group({
      codigo: [pregunta.codigo],
      pregunta: [pregunta.pregunta],
      orden: [pregunta.orden],
      estado: [pregunta.estado],
      respuesta: pregunta.respuesta ? [pregunta.respuesta] : [false]
    }));
  }

  private irResumenCoberturasVenta(codigo: string) {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS,
      codigo
    ]);
  }

  private mostrarBotonFinalizar() {
    this.mostrarFinalizar = this.items.length - 1 === this.activeIndex ? true : false;
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

  private transformarSipProteccionesEventosAMimCotizacionDetalle(sipProteccionesEventosSet: any) {
    const mimCotizacionDetalle = {
      codigo: this.vieneDeFlujo ? sipProteccionesEventosSet.consecutivo : null,
      codigoPlanCobertura: sipProteccionesEventosSet.mimPlanCobertura ? sipProteccionesEventosSet.mimPlanCobertura.codigo : null,
      cuota: sipProteccionesEventosSet.proCuota,
      mimPlanCobertura: sipProteccionesEventosSet.mimPlanCobertura || null,
      sipFactores: sipProteccionesEventosSet.factorCodigo,
      valorProteccion: sipProteccionesEventosSet.proValor
    } as any;

    if (sipProteccionesEventosSet.sipProteccionesEventosRelacionado &&
      sipProteccionesEventosSet.sipProteccionesEventosRelacionado !== null &&
      sipProteccionesEventosSet.sipProteccionesEventosRelacionado !== undefined) {
      mimCotizacionDetalle.mimCotizacionDetalleRelacionado = this.transformarSipProteccionesEventosAMimCotizacionDetalle(sipProteccionesEventosSet.sipProteccionesEventosRelacionado);
    }

    return mimCotizacionDetalle;
  }

  private transformarMimCotizacionDetalleASipProteccionesEventos(mimCotizacionDetalle: any) {
    const sipProteccioneseventos = {
      codigoPlan: this.datosForm.codigoPlan,
      codigoCobertura: mimCotizacionDetalle.mimPlanCobertura?.mimCobertura?.codigo,
      asoNumInt: this.datosForm.asoNumInt,
      proValorSolicitado: mimCotizacionDetalle.valorProteccion,
      proValor: mimCotizacionDetalle.valorProteccion,
      proCuota: mimCotizacionDetalle.cuota,
      factorValor: mimCotizacionDetalle.sipFactores?.valor,
      factorCodigo: mimCotizacionDetalle.sipFactores,
      proFechaRegistro: this.datosForm.fechaSolicitud,
      proFechaSolicitud: this.datosForm.fechaSolicitud,
      proEstado: SIP_PARAMETROS_TIPO.ESTADO_ACTIVO,
      consecutivo: this.vieneDeFlujo ? mimCotizacionDetalle.codigo : null,
      codigoTransacion: this.vieneDeFlujo ? this.datosForm.codigo : null
    } as any;

    if (mimCotizacionDetalle.mimCotizacionDetalleRelacionado !== null
      && mimCotizacionDetalle.mimCotizacionDetalleRelacionado !== undefined) {
      sipProteccioneseventos.sipProteccionesEventosRelacionado = this.transformarMimCotizacionDetalleASipProteccionesEventos(mimCotizacionDetalle.mimCotizacionDetalleRelacionado);
    }

    return sipProteccioneseventos;
  }

  private async configurarSipVinculaciones(sipVinculaciones: any): Promise<string> {
    let mensaje = null;
    this.sipVinculaciones = sipVinculaciones;
    if (this.sipVinculaciones.mimControlCumuloList.length <= 0) {
      mensaje = await this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.alertas.noCUmulosParaPlan').toPromise();
      this.llenarMimControlCumuloList(this.sipVinculaciones);
    }
    return mensaje;
  }

  private async configurarMimMovimientoPlanCanal(mimMovimientoPlanCanal: any): Promise<string> {
    let mensaje = null;
    this.movimientoPlanCanal = mimMovimientoPlanCanal;
    if (mimMovimientoPlanCanal.length <= 0) {
      mensaje = await this.translate.get('asociado.protecciones.portafolio.cotizacion.acumuladosDelAsociado.alertas.noPlanCanalMovimiento').toPromise();
    }
    return mensaje;
  }

  private configurarMimCanalVenta() {
    this.canalVentas = this.removerRepetidos(this.movimientoPlanCanal.map(mimMovimientoPlanCanal => mimMovimientoPlanCanal.mimPlanCanalVenta.mimCanalVenta));
    this.canalVentas.sort((a, b) => b.nombre - a.nombre);
  }

  private configurarMimProyectoVida(mimProyectoVida: any) {
    this.cualProyectoVida = [
      ...mimProyectoVida,
      { codigo: 0, nombre: 'Otro' }
    ];
  }

  private async configurarMimPorcentajeCuota(vinCod: any) {
    const _porcentajeCuota: any = await this.backService.porcentajeCuotas.getPorcentajeCuotas({
      'sipCategoriaAsociado.codigo': vinCod, estado: true
    }).toPromise().catch(err => {
      this.frontService.alert.error(err.error.message);
    });
    this.porcentajeCuota = _porcentajeCuota.content[0];
  }

  private llenarMimControlCumuloList(items: any) {
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

  private async configurarDesplegables() {
    // Si existe un detalle del canal se obtienen los usuarios relacionados al canal
    if (this.datosForm.mimCanal !== null && this.datosForm.mimCanal !== undefined) {
      // Obtenemos las listas de los planes y tipo-plan
      this.planesAll = [];
      this.tipoPlanes = [];
      this.fondos = [];
      this.movimientoPlanCanal.map(mimMovimientoPlanCanal => {
        if (mimMovimientoPlanCanal.mimPlanCanalVenta.mimCanalVenta.codigo === this.datosForm.mimCanal.codigo) {
          this.planesAll.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan);
          this.tipoPlanes.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan.mimTipoPlan);
          this.fondos.push(mimMovimientoPlanCanal.mimPlanCanalVenta.mimPlan.mimFondo);
        }
      });
      const _promotoresComerciales = await this.backService.promotor.getPromotores({ estado: true }).toPromise().catch(err => {
        this.frontService.alert.warning(err.error.message);
      });
      this.promotoresComerciales = _promotoresComerciales._embedded.mimPromotor;

      // Si existe un detalle del plan se consulta plan-cobertura
      if (this.datosForm.mimPlan) {
        const _planes = this.planesAll.filter(item => item.mimTipoPlan.codigo === this.datosForm.mimPlan.mimTipoPlan.codigo);
        this.planes = _planes.sort((a, b) => b.nombre - a.nombre);

        // Se obtienen plan-caberturas
        const paramsPlanCobertura = {
          'mimPlan.mimTipoPlan.codigo': this.datosForm.mimPlan.mimTipoPlan.codigo,
          'mimPlan.codigo': this.datosForm.mimPlan.codigo,
          'mimCobertura.coberturaBasica': true,
          'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO,
        };
        const _planCoberturas = await this.backService.planCobertura.getPlanesCoberturas(paramsPlanCobertura).toPromise().catch(err => {
          this.frontService.alert.warning(err.error.message);
        });
        this.planCoberturas = _planCoberturas.content;
      }
    }
  }

  private configurarDataInitComponentes() {
    this.dataInitValidar = {
      canalVentas: this.canalVentas,
      promotoresComerciales: this.promotoresComerciales,
      tipoCotizaciones: null,
      esVenta: true,
      bloquearFechaSolicitud: this.bloquearFechaSolicitud
    };

    this.dataInitCotizar = {
      fondos: this.fondos,
      tipoPlanes: this.tipoPlanes,
      planes: this.planes,
      cualProyectoVida: this.cualProyectoVida,
      salarioMinimo: this.salarioMinimo,
      rentaDiariaRecomendada: this.datosForm.rentaDiaria || 0
    };

    this.dataInitTipoCalculo = {
      porcentajeCuota: this.porcentajeCuota,
      mimPlanCobertura: this.planCoberturas
    };

    this.dataInitDeclaracionSalud = {
      declaracionSalud: this.declaracionSalud,
      mostrarAmpliarRespuesta1: this.mostrarAmpliarRespuesta1,
      mostrarAmpliarRespuesta2: this.mostrarAmpliarRespuesta2,
      maxDateValue: new Date(),
      imc: this.imc,
      dataInitDecldeshabilitaFechaDiag: false
    };
  }

}
