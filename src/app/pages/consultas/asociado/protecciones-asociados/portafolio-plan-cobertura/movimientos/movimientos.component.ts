import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO_NORMAL, SIP_ASOCIADOS_VALIDAR_ESTADO_INACTIVO, ValidacionesParametrosFactory } from '@shared/util/validaciones-parametros-factory';
import { forkJoin, Subscription } from 'rxjs';
import * as acciones from '../portafolio.actions';
import { MimEstadoCotizacionService } from '../services/mim-estado-cotizacion.service';
import { MimTransaccionService } from '../services/mim-transaccion.service';
import { MovimientosConfig } from './movimientos.config';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MovimientosComponent implements OnInit, OnDestroy {

  form: FormGroup;
  tipoMovimientos: any;
  estados: any;
  canalVentas: any;
  promotoresComerciales: any;
  maxDateValue: any;
  asoNumInt = '';
  subs: Subscription[] = [];
  configuracion: MovimientosConfig = new MovimientosConfig();
  cotizaciones: any;
  filtros: any;
  datosAsociado: any;
  validacionesParametros: any;

  idProceso: any;
  mostrarBitacora: any;
  mostrarFase: boolean;

  formCambioEstado: FormGroup;
  mostrarModalCambioEstado: boolean;
  rowCambiarEstadoCotizacion: any;
  estadosCotizacion: any;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly formBuilde: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly dataService: DataService,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly estadoCotizacionService: MimEstadoCotizacionService,
    private readonly transaccionService: MimTransaccionService
  ) {
    this.tipoMovimientos = [];
    this.estados = [];
    this.canalVentas = [];
    this.promotoresComerciales = [];
    this.maxDateValue = new Date();
    this.estadosCotizacion = [];
  }

  ngOnDestroy(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: true }));
    this.subs.forEach((item: Subscription) => item.unsubscribe());
  }

  ngOnInit(): void {
    if (!this.mostrarFase) {
      this.configuracion.columnsAll();
    } else {
      this.configuracion.columnMinimo();
    }
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));
    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.subs.push(this.dataService
      .asociados()
      .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
        if (!respuesta) {
          return;
        }
        this.datosAsociado = respuesta.datosAsociado;
        this.getDatos();
      }));

    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilde.group({
      documento: new FormControl(null),
      fechaInicioFechaFin: new FormControl(null, [CustomValidators.RangoFechaDias(30)]),
      tipoMovimiento: new FormControl(null),
      estado: new FormControl(null),
      canalVenta: new FormControl(null),
      promotorComercial: new FormControl(null)
    },
      { validators: [CustomValidators.RangoFechaObligatorio] });
    this.form.controls.promotorComercial.disable();
    this.changeForm();
  }

  private changeForm() {
    this.form.controls.canalVenta.valueChanges.subscribe(item => {
      this.promotoresComerciales = [];
      if (item) {
        // this.sisproService.getUsuariosPorRol(item.codigoRol).subscribe(resp => {
        this.backService.promotor.getPromotores({ estado: true, 'mimCanal.codigo': item.codigo }).subscribe(resp => {
          this.form.controls.promotorComercial.enable();
          this.promotoresComerciales = resp._embedded.mimPromotor;
        });
      }
    });
  }

  limpiarForm() {
    this.filtros = null;
    this.form.reset();
    this.consultaMovimientos();
  }

  buscarForm() {
    const _form = this.form.getRawValue();
    if (_form.documento) {
      this.filtros = { ...this.filtros, codigo: _form.documento };
    }
    if (_form.fechaInicioFechaFin) {
      const fechaInicio = DateUtil.dateToString(_form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
      const fechaFin = _form.fechaInicioFechaFin[1] ? DateUtil.dateToString(_form.fechaInicioFechaFin[1], 'dd-MM-yyyy') : null;
      this.filtros = {
        ...this.filtros,
        fechaInicioSolicitud: `${fechaInicio} 00:00:00`,
        fechaFinSolicitud: fechaFin ? `${fechaFin} 23:59:59` : `${fechaInicio} 23:59:59`
      };
    }
    if (_form.tipoMovimiento) {
      this.filtros = { ...this.filtros, codigoTransaccion: _form.tipoMovimiento.codigo };
    }
    if (_form.estado) {
      this.filtros = { ...this.filtros, codigoEstado: _form.estado.codigo };
    }
    if (_form.canalVenta) {
      this.filtros = { ...this.filtros, codigoCanal: _form.canalVenta.codigo };
      if (_form.promotorComercial) {
        this.filtros = { ...this.filtros, promotorComercial: _form.promotorComercial.identification };
      }
    }
    if (!this.filtros) {
      this.translate.get('global.noHayParametros').subscribe((response: string) => {
        this.frontService.alert.info(response);
      });
      return;
    }
    this.consultaMovimientos();
  }

  private getDatos() {
    const paramTransacciones = { page: 0, size: 10, isPaged: true, sort: 'fechaCreacion,desc', asoNumInt: this.asoNumInt };
    const peticion = {};
    const paramEstados = [MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE, MIM_PARAMETROS.MIM_ESTADO_COTIZACION.EN_PROCESO_VENTA];
    peticion[SIP_ASOCIADOS_VALIDAR_ESTADO_INACTIVO] = ValidacionesParametrosFactory.parametrosSipAsociadosValidarEstadoInactivo(this.datosAsociado.estAso);
    peticion[SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO_NORMAL] = ValidacionesParametrosFactory.parametrosSipAsociadosValidarEstadoActivoNormal(this.datosAsociado.estAso);
    forkJoin({
      _transacciones: this.transaccionService.getTransacciones(paramTransacciones),
      _tipoMovimientos: this.backService.tiposMovimientos.getTiposMovimientos({
        estado: true,
        codigo: [GENERALES.TIPO_MOVIMIENTO.COTIZACION, GENERALES.TIPO_MOVIMIENTO.INCREMENTAR]
      }),
      _estados: this.estadoCotizacionService.getEstadosContizacion({ codigo: paramEstados }),
      _tipoCanales: this.backService.canal.getCanalesVentas({ estado: true }),

      _validaciones: this.backService.validaciones.postValidaciones(peticion)
    }).subscribe(items => {
      this.listarMovimientos(items._transacciones);
      this.tipoMovimientos = items._tipoMovimientos._embedded.mimTipoMovimiento;
      this.estados = items._estados._embedded.mimEstadoCotizacion;
      this.canalVentas = items._tipoCanales._embedded.mimCanal;
      this.validacionesParametros = items._validaciones;
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private async consultaMovimientos(pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    let param: any = { page: pagina, size: tamanio, isPaged: true, sort: sort, asoNumInt: this.asoNumInt };
    if (this.filtros) {
      param = { ...param, ...this.filtros };
    }
    this.cotizaciones = await this.transaccionService.getTransacciones(param).toPromise()
      .catch(err => { this.frontService.alert.error(err.error.message); });
    this.listarMovimientos(this.cotizaciones);
  }

  private listarMovimientos(cotizaciones: any) {
    this.configuracion.gridConfig.component.limpiar();
    if (!cotizaciones || !cotizaciones.content || cotizaciones.content.length === 0) {
      if (this.filtros) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
      }
      return;
    }

    this.configuracion.gridConfig.component.cargarDatos(
      this.transformarDatos(cotizaciones.content), {
      maxPaginas: cotizaciones.totalPages,
      pagina: cotizaciones.number,
      cantidadRegistros: cotizaciones.totalElements
    });
  }

  private transformarDatos(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _nombreFaseFlujo: item.mimTipoMovimiento.codigo === MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.INCREMENTO && item.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_VENTA.EN_VALIDACION ? item.nombreFaseFlujo : null,
        _codigoColorFase: item.mimTipoMovimiento.codigo === MIM_PARAMETROS.MIM_TIPO_MOVIMIENTO.INCREMENTO && item.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_VENTA.EN_VALIDACION && item.nombreFaseFlujo ? item.codigoColorEstado : null
      });
    }
    return listObj;
  }

  clickMas(event: any) {

    // Si es una acción diferente al más(tres puntos)
    if (event.col.key === 'codigo') {
      if (event.dato.mimTipoMovimiento && event.dato.mimTipoMovimiento.codigo === GENERALES.TIPO_MOVIMIENTO.COTIZACION
        && event.dato.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE) {
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN,
          event.dato.codigo
        ]);
      } else {
        return;
      }
    } else {
      let listAccion = [];

      this.frontService.scope.obtenerComponents('MM_CONSUL_ASOC_PRO_PORT_ACCION')
        .map(x => listAccion.push({ label: x.name, value: x.code, cssIcon: x.image }));

      if (event.dato.mimTipoMovimiento.codigo === GENERALES.TIPO_MOVIMIENTO.COTIZACION) {
        listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.ACTIVACION_SOLICITUD);

        listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.DETALLE_INCREMENTO);
        listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.BITACORA_MOVIMIENTO);
        if (event.dato.codigoEstado !== MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE) {
          listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.VENTA_APARTIR_COTIZACION);
        }
        if (event.dato.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_COTIZACION.DISPONIBLE ||
          event.dato.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_COTIZACION.EN_PROCESO_VENTA) {
          listAccion.push({ label: 'Cambiar estado', value: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_CAMBIAR_ESTADO', cssIcon: 'icon-edit-3' });
        }
      }
      if (event.dato.mimTipoMovimiento.codigo === GENERALES.TIPO_MOVIMIENTO.INCREMENTAR) {
        listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.DETALLE_COTIZACION);
        listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.VENTA_APARTIR_COTIZACION);

        if (event.dato.codigoEstado !== MIM_PARAMETROS.MIM_ESTADO_VENTA.SUSPENDIDA) {
          // listAccion.push({ label: 'Activar solicitud', value: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_ACTIVAR', cssIcon: 'icon-check-square' })
          listAccion = listAccion.filter(item => item.value !== GENERALES.MOVIMIENTOS_ACCIONES.ACTIVACION_SOLICITUD);
        }
        if (event.dato.codigoEstado === MIM_PARAMETROS.MIM_ESTADO_VENTA.EN_VALIDACION) {
          listAccion.push({ label: 'Anular', value: 'MM_CONSUL_ASOC_PRO_PORT_ACCION_ANULAR', cssIcon: 'icon-cross' });
        }
      }

      this.configuracion.popupMenu.items = listAccion;
      this.configuracion.popupMenu.component.mostrar(event.e.x,
        event.e.y, event.dato);
    }

  }

  clickItemPopup(e) {
    switch (e.item.value) {
      case GENERALES.MOVIMIENTOS_ACCIONES.VENTA_APARTIR_COTIZACION:
        const esValido = this.validacionesParametros.validaciones.find(item => item.result === false && item.key === SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO_NORMAL);
        if (esValido) {
          this.frontService.alert.info(esValido.message);
          return;
        }

        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN,
          e.dato.codigo
        ]);
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.DESCARGAR_MOVIMIENTO:
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.DETALLE_COTIZACION:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_COTIZACION_COBERTURAS,
          e.dato.codigo
        ]);
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.ACTIVACION_SOLICITUD:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_ACTIVAR_SOLICITUDES_SUSPENDIDAS,
          UrlRoute.PROCESO,
          e.dato.idProceso
          // UrlRoute.TAREA,
          // this.idTarea
        ]);
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.ANULAR_VENTA:
        this.anularVenta(e.dato.idProceso);
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.DETALLE_INCREMENTO:
        this.router.navigate([
          UrlRoute.PAGES,
          UrlRoute.CONSULTAS,
          UrlRoute.CONSULTAS_ASOCIADO,
          this.asoNumInt,
          UrlRoute.PROTECCIONES,
          UrlRoute.PORTAFOLIO_BETA,
          UrlRoute.PORTAFOLIO_PLAN_COBERTURA_RESUMEN_VENTA_COBERTURAS,
          e.dato.idProceso
        ]);
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.BITACORA_MOVIMIENTO:
        this.idProceso = e.dato.idProceso;
        this.mostrarBitacora = true;
        break;
      case GENERALES.MOVIMIENTOS_ACCIONES.CAMBIAR_ESTADO:
        this.rowCambiarEstadoCotizacion = e.dato;
        this.toggleModalCambioEstado();
        break;
    }
  }

  cerrarModalBitacora() {
    this.mostrarBitacora = false;
    this.idProceso = undefined;
  }

  atras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA
    ]);
  }

  siguienteAtrasTable(event: any) {
    this.consultaMovimientos(event.pagina, event.tamano);
  }

  nuevaCotizacion() {
    const esValido = this.validacionesParametros.validaciones.find(item => item.result === true && item.key === SIP_ASOCIADOS_VALIDAR_ESTADO_INACTIVO);
    if (esValido) {
      this.frontService.alert.info(esValido.message);
      return;
    }
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_COTIZACION_PLAN
    ]);

  }

  realizarVenta() {
    const esValido = this.validacionesParametros.validaciones.find(item => item.result === false && item.key === SIP_ASOCIADOS_VALIDAR_ESTADO_ACTIVO_NORMAL);
    if (esValido) {
      this.frontService.alert.info(esValido.message);
      return;
    }
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_VENTA_PLAN
    ]);
  }

  private initformCambioEstado(codigoEstado?: any) {
    this.formCambioEstado = this.formBuilde.group({
      estados: new FormControl(codigoEstado ? this.estadosCotizacion[0] : null, [Validators.required])
    });
  }

  toggleModalCambioEstado() {
    this.estadosCotizacion = this.estados.filter(x => x.codigo !== this.rowCambiarEstadoCotizacion.codigoEstado);
    this.initformCambioEstado(this.rowCambiarEstadoCotizacion.codigoEstado);
    this.mostrarModalCambioEstado = !this.mostrarModalCambioEstado;
  }

  guardarCambiarEstado() {
    const mimCotizacionParchada = {
      codigo: this.rowCambiarEstadoCotizacion.codigo,
      mimEstadoCotizacion: this.formCambioEstado.controls.estados.value
    };
    this.backService.cotizacion.patchCotizacion(this.rowCambiarEstadoCotizacion.codigo, mimCotizacionParchada).subscribe(() => {
      this.translate.get('asociado.protecciones.portafolio.movimientos.modal.alerta.estadoActualizado').subscribe(mensaje => {
        this.frontService.alert.success(mensaje).then(() => {
          this.getDatos();
          this.toggleModalCambioEstado();
          this.configuracion.popupMenu.component.ocultar();
        });
      });
    }, err => this.frontService.alert.warning(err.error.message));
  }

  async anularVenta(idProceso: any) {
    const _venta = await this.backService.venta.getVenta({
      'idProceso': idProceso
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    const venta = _venta.content[0];

    // TODO(bayron): Enviar labels a json de idiomas.
    this.translate.get('asociado.protecciones.portafolio.movimientos.alerts.anularVenta', { solicitud: venta.idProceso }).subscribe((mensaje: string) => {
      this.frontService.alert.inputAnular(mensaje, 'Observación', 'textarea').then((result: any) => {
        if (result != null || result != undefined) {
          // Configuramos las observaciones.
          const variables = {} as any;
          variables.comment = result;
          venta.variables = variables;

          this.backService.venta.postAnularVenta(venta).subscribe((mimVenta: any) => {
            this.frontService.alert.success(mimVenta.message).then(() => {
              // Redireccionamos a listar todos los movimientos
              this.consultaMovimientos();
              this.configuracion.popupMenu.component.ocultar();
            });
          }, (err) => {
            this.frontService.alert.error(err.error.message);
          });
        }
      });
    });
  }

}
