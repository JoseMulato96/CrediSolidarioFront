import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { GuardarCoberturasConfig } from './guardar-coberturas.config';

@Component({
  selector: 'app-guardar-coberturas',
  templateUrl: './guardar-coberturas.component.html',
})
export class GuardarCoberturasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  codigoCobertura: any;
  solicitud: string;
  idProceso: string;
  showForm: boolean;
  showControlsAprobacion: boolean;

  cobertura: any;
  _esCreacion: boolean;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;

  mostrarDigitoVerificacion: boolean;
  patterns = masksPatterns;

  fondos: any[];
  origenes: any[];
  estados: any[];

  configuracion: GuardarCoberturasConfig = new GuardarCoberturasConfig();
  unidadesEventos: any[];
  estadoFecha: boolean;
  observacionesPrueba: any[];
  observaciones: any;
  botonesAutoriza: boolean;
  clientes: any[];
  idTarea: string;
  esDirectorTecnico: boolean;
  fechaInicioFechaFinMantenerSeleccionadas: Date[];
  clientesAll: any[];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {

    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCobertura = params.codigoCobertura;
      this.solicitud = params.solicitud || null;
      this.idProceso = params.processInstanceId || null;
      this.idTarea = params.taskId || null;
      this.showControlsAprobacion = this.idTarea !== null ? true : false;

      let objDatos = {
        _estadosCoberturas: this.backService.estadoCobertura.obtenerEstadosCoberturas({
          estado: true, codigo: [MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO,
          MIM_PARAMETROS.MIM_ESTADO_COBERTURA.PROCESO]
        }),
        _origenCoberturas: this.backService.origenCoberturas.obtenerOrigenCoberturas({ estado: true, isPaged: true, sort: 'nombre,asc', size: 1000000 }),
        // _fondos: this.fondosService.getFondos({ estado: true }),
        _unidadesEventos: this.backService.unidadTiempo.obtenerUnidadesTiempo({ estado: true }),
        _clientes: this.backService.cliente.obtenerClientes({ isPaged: true, sort: 'nombre,asc', 'size': 1000000 })
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

      forkJoin(objDatos).subscribe((resp: any) => {
        this.estados = resp._estadosCoberturas._embedded.mimEstadoCobertura.filter(item => item.codigo !== MIM_PARAMETROS.MIM_ESTADO_COBERTURA.OBSERVACION);
        this.origenes = resp._origenCoberturas.content;
        this.unidadesEventos = resp._unidadesEventos._embedded.mimUnidadTiempo;
        this.clientesAll = resp._clientes.content;
        this.observaciones = this.idProceso ? resp._observaciones : null;
        this.esDirectorTecnico = resp._esDirectorTecnico ? resp._esDirectorTecnico.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_TECNICO ? true : false : false;

        if (this.codigoCobertura) {
          this.backService.cobertura.obtenerCobertura(this.codigoCobertura).subscribe((_cobertura: any) => {
            this.cobertura = _cobertura;
            this._setRowInactivo(_cobertura);
            this._esCreacion = false;
            this.clientes = this.clientesAll;
            this._initForm(this.cobertura);
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          });
        } else {
          this._esCreacion = true;
          this.clientes = this.clientesAll.filter(resp => resp.mimEstadoCliente.codigo === MIM_PARAMETROS.MIM_ESTADO_CLIENTE.ACTIVO);
          this._initForm();
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });

    }));

  }

  _setRowInactivo(row: any) {
    if (!row.mimUnidadTiempo) {
      return;
    }
    if (!this._esCreacion && !this.obtenerEstadoCobertura(row.mimEstadoCobertura.codigo)) {
      this.estados.push(row.mimEstadoCobertura);
    }
    if (!this._esCreacion && !this.obtenerUnidadTiempo(row.mimUnidadTiempo.codigo)) {
      this.unidadesEventos.push(row.mimUnidadTiempo);
    }

    row.mimOrigenCoberturaList.forEach(item => {
      if (item && !item.estado) {
        this.origenes.push(item);
      }
    });
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  _initForm(cobertura?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        // Datos principales de la cobertura
        cliente: new FormControl(cobertura ? this.obtenerCliente(cobertura.mimFondo) : null, [Validators.required]),
        codigo: new FormControl(cobertura ? cobertura.codigo : null),
        fondo: new FormControl(cobertura ? this._getFondos(cobertura.mimFondo.mimCliente.codigo, cobertura) : null, [Validators.required]),
        nombre: new FormControl(cobertura ? cobertura.nombre : null, [Validators.required, CustomValidators.vacio]),
        nombreCorto: new FormControl(cobertura ? cobertura.nombreCorto : null, [Validators.required, CustomValidators.vacio]),
        origen: new FormControl(cobertura ? this.obtenerOrigenCobertura(cobertura.mimOrigenCoberturaList) : null, [Validators.required]),
        estado: new FormControl(cobertura ? this.obtenerEstadoCobertura(cobertura.mimEstadoCobertura.codigo) : null, [Validators.required]),
        asistencia: new FormControl(cobertura && cobertura.asistencia ? cobertura.asistencia : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(cobertura ? this.rangoFechaSelected(cobertura.fechaInicio, cobertura.fechaFin) : null, [Validators.required]),
        numeroEventos: new FormControl(cobertura && cobertura.preescripcion ? cobertura.preescripcion : null, [
          Validators.required,
          Validators.min(0),
          Validators.max(999)]),
        unidadEventos: new FormControl(cobertura && cobertura.mimUnidadTiempo ?
          this.obtenerUnidadTiempo(cobertura.mimUnidadTiempo.codigo)
          : null, [Validators.required]),

        // Condiciones Venta
        planFamiliar: new FormControl(cobertura && cobertura.aplicaPlanFamiliar ? cobertura.aplicaPlanFamiliar : false, [Validators.required]),
        renunciarAmparo: new FormControl(cobertura && cobertura.renunciaAmparo ? cobertura.renunciaAmparo : false, [Validators.required]),
        incremento: new FormControl(cobertura && cobertura.incrementoProteccion ? cobertura.incrementoProteccion : false, [Validators.required]),
        disminucionProteccion: new FormControl(cobertura && cobertura.disminucionProteccion ? cobertura.disminucionProteccion : false, [Validators.required]),
        requisitosMedicos: new FormControl(cobertura && cobertura.requisitosMedicos ? cobertura.requisitosMedicos : false, [Validators.required]),
        tieneFacturacion: new FormControl(cobertura && cobertura.facturacion ? cobertura.facturacion : false, [Validators.required]),
        tieneProyeccion: new FormControl(cobertura && cobertura.tieneProyeccion ? cobertura.tieneProyeccion : false, [Validators.required]),
        tieneEstadistica: new FormControl(cobertura && cobertura.tieneEstadistica ? cobertura.tieneEstadistica : false, [Validators.required]),

        // Condiciones destinacion
        disponibleGarantia: new FormControl(cobertura && cobertura.disponibleParaGarantia ? cobertura.disponibleParaGarantia : false, [Validators.required]),

        // Condiciones movimientos
        aplicaReactivacion: new FormControl(cobertura && cobertura.aplicaReactivacion ? cobertura.aplicaReactivacion : false, [Validators.required]),
        aplicaRevocatoria: new FormControl(cobertura && cobertura.aplicaRevocatoria ? cobertura.aplicaRevocatoria : false, [Validators.required]),
        aplicaHabilitacion: new FormControl(cobertura && cobertura.aplicaHabilitacion ? cobertura.aplicaHabilitacion : false, [Validators.required]),
        aplicaReceso: new FormControl(cobertura && cobertura.aplicaReceso ? cobertura.aplicaReceso : false, [Validators.required]),
        aplicaReingreso: new FormControl(cobertura && cobertura.aplicaReingreso ? cobertura.aplicaReingreso : false, [Validators.required]),

        // Condiciones indemnizacion
        puedeCancelar: new FormControl(cobertura && cobertura.cancelar ? cobertura.cancelar : false, [Validators.required]),
        devolucionRetiro: new FormControl(cobertura && cobertura.devolucionRetiro ? cobertura.devolucionRetiro : false, [Validators.required]),
        prorroga: new FormControl(cobertura && cobertura.prorroga ? cobertura.prorroga : false, [Validators.required]),
        tieneRescate: new FormControl(cobertura && cobertura.rescate ? cobertura.rescate : false, [Validators.required]),
        exoneracionPago: new FormControl(cobertura && cobertura.exoneracionPago ? cobertura.exoneracionPago : false, [Validators.required]),
        beneficiarios: new FormControl(cobertura && cobertura.beneficiarios ? cobertura.beneficiarios : false, [Validators.required]),
        aplicaSubsistencia: new FormControl(cobertura && cobertura.aplicaSubsistencia ? cobertura.aplicaSubsistencia : false, [Validators.required]),
        aplicaDisminucionPorAnticipoPago: new FormControl(cobertura && cobertura.aplicaDisminucionPorAnticipoPago ? cobertura.aplicaDisminucionPorAnticipoPago : false, [Validators.required]),
        beneficiosPorPreexistencia: new FormControl(cobertura && cobertura.beneficiosPorPreexistencia ? cobertura.beneficiosPorPreexistencia : false, [Validators.required]),
        reconocimientoPermanencia: new FormControl(cobertura && cobertura.reconocimientoPermanencia ? cobertura.reconocimientoPermanencia : false, [Validators.required]),
      }));

    // El codigo cliente siempre debera estar deshabilitado.
    this.form.controls.codigo.disable();

    if (!this._esCreacion) {
      this.fechaInicioFechaFinMantenerSeleccionadas = [DateUtil.stringToDate(cobertura ? cobertura.fechaInicio : null)];
      if (cobertura && cobertura.asistencia) {
        this._estadoControles(true);
      }
      this.form.controls.cliente.disable();
      this.form.controls.asistencia.disable();
      this.form.controls.fondo.disable();
      this.estadoFecha = (cobertura !== null && cobertura !== undefined && cobertura.mimEstadoCobertura.codigo === 1) || (this.idTarea !== null);
      if (cobertura && cobertura.mimEstadoCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_COBERTURA.INACTIVO) {
        this.form.disable();
      }
      this.form.controls.estado.enable();
      if (this.solicitud !== null && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
        this.form.disable();
        this.showForm = true;
      }
      if (this.solicitud !== null || this.idTarea) {
        this.form.disable();
      }
    }
    if (cobertura && cobertura.asistencia) {
      this.form.controls.unidadEventos.clearValidators();
      this.form.controls.numeroEventos.clearValidators();
    }
    this._change(cobertura);

    if (cobertura && cobertura.mimFondo) {
      this.disbaledStatusForClientFond(cobertura.mimFondo.mimCliente.mimEstadoCliente.codigo, cobertura.mimFondo.estado);
    }
  }

  private disbaledStatusForClientFond(statusClient: any, statusFond: any) {
    if (statusClient === GENERALES.MIM_ESTADOS_CLIENTE.NO_DISPONIBLE && !statusFond) {
      this.form.controls.estado.disable();
    } else {
      this.form.controls.estado.enable();
    }
  }

  _change(cobertura?: any) {
    this.form.controls.cliente.valueChanges.subscribe(item => {
      if (item) {
        this._getFondos(item.codigo, cobertura);
      }
    });
    this.form.controls.asistencia.valueChanges.subscribe(item => {
      if (item) {
        this.form.controls.unidadEventos.setErrors(null);
        this.form.controls.numeroEventos.setErrors(null);
      } else {
        this.form.controls.unidadEventos.setErrors({ required: true });
        this.form.controls.numeroEventos.setErrors({ required: true });
      }
    });
  }

  _getFondos(codigoCliente: any, cobertura?: any) {
    this.backService.fondo.getFondos({ 'mimCliente.codigo': codigoCliente, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }).subscribe(respuesta => {
      this.fondos = respuesta.content;
      if (!this._esCreacion) {
        if (!this.obtenerFondo(cobertura.mimFondo.codigo)) {
          this.fondos.push(cobertura.mimFondo);
        }
        this.form.controls.fondo.setValue(cobertura.mimFondo);
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _alGuardarCobertura() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crearCobertura();
    } else {
      this._actualizarCobertura();
    }
  }

  _actualizarCobertura() {
    this._copiarACobertura();
    this.backService.cobertura.actualizarCobertura(this.codigoCobertura, this.cobertura).subscribe((_cobertura: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar clientes.
          this._irACoberturas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private _copiarACobertura() {

    // Datos principales de la cobertura
    this.cobertura.mimFondo = this.form.controls.fondo.value;
    this.cobertura.nombre = this.form.controls.nombre.value;
    this.cobertura.nombreCorto = this.form.controls.nombreCorto.value;
    const mimOrigenCoberturaList = [];
    this.form.controls.origen.value.forEach(x => {
      mimOrigenCoberturaList.push({ codigo: x.codigo });
    });
    this.cobertura.mimOrigenCoberturaList = mimOrigenCoberturaList;
    this.cobertura.mimEstadoCobertura = this.form.controls.estado.value;
    this.cobertura.asistencia = this.form.controls.asistencia.value;

    this.cobertura.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.cobertura.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    this.cobertura.preescripcion = this.form.controls.numeroEventos.value;
    this.cobertura.mimUnidadTiempo = this.form.controls.unidadEventos.value;

    // Condiciones Venta
    this.cobertura.aplicaPlanFamiliar = this.form.controls.planFamiliar.value;
    this.cobertura.renunciaAmparo = this.form.controls.renunciarAmparo.value;
    this.cobertura.incrementoProteccion = this.form.controls.incremento.value;
    this.cobertura.disminucionProteccion = this.form.controls.disminucionProteccion.value;
    this.cobertura.requisitosMedicos = this.form.controls.requisitosMedicos.value;
    this.cobertura.facturacion = this.form.controls.tieneFacturacion.value;
    this.cobertura.tieneProyeccion = this.form.controls.tieneProyeccion.value;
    this.cobertura.tieneEstadistica = this.form.controls.tieneEstadistica.value,

      // Condiciones destinacion
      this.cobertura.disponibleParaGarantia = this.form.controls.disponibleGarantia.value;

    // Condiciones movimientos
    this.cobertura.aplicaReactivacion = this.form.controls.aplicaReactivacion.value;
    this.cobertura.aplicaRevocatoria = this.form.controls.aplicaRevocatoria.value;
    this.cobertura.aplicaHabilitacion = this.form.controls.aplicaHabilitacion.value;
    this.cobertura.aplicaReceso = this.form.controls.aplicaReceso.value;
    this.cobertura.aplicaReingreso = this.form.controls.aplicaReingreso.value;

    // Condiciones indemnizacion
    this.cobertura.cancelar = this.form.controls.puedeCancelar.value;
    this.cobertura.devolucionRetiro = this.form.controls.devolucionRetiro.value;
    this.cobertura.prorroga = this.form.controls.prorroga.value;
    this.cobertura.rescate = this.form.controls.tieneRescate.value;
    this.cobertura.exoneracionPago = this.form.controls.exoneracionPago.value;
    this.cobertura.beneficiarios = this.form.controls.beneficiarios.value;
    this.cobertura.aplicaSubsistencia = this.form.controls.aplicaSubsistencia.value;
    this.cobertura.aplicaDisminucionPorAnticipoPago = this.form.controls.aplicaDisminucionPorAnticipoPago.value;
    this.cobertura.beneficiosPorPreexistencia = this.form.controls.beneficiosPorPreexistencia.value;
    this.cobertura.reconocimientoPermanencia = this.form.controls.reconocimientoPermanencia.value;
  }

  _crearCobertura() {
    const mimOrigenCoberturaList = [];
    this.form.controls.origen.value.forEach(x => {
      mimOrigenCoberturaList.push({ codigo: x.codigo });
    });
    const cobertura = {

      // Datos principales de la cobertura
      mimFondo: this.form.controls.fondo.value,
      nombre: this.form.controls.nombre.value,
      nombreCorto: this.form.controls.nombreCorto.value,

      // mimOrigenCobertura: this.form.controls.origen.value,
      mimOrigenCoberturaList: mimOrigenCoberturaList,
      mimEstadoCobertura: this.form.controls.estado.value,
      asistencia: this.form.controls.asistencia.value,

      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      preescripcion: this.form.controls.numeroEventos.value,
      mimUnidadTiempo: this.form.controls.unidadEventos.value,

      // Condiciones Venta
      aplicaPlanFamiliar: this.form.controls.planFamiliar.value,
      renunciaAmparo: this.form.controls.renunciarAmparo.value,
      incrementoProteccion: this.form.controls.incremento.value,
      disminucionProteccion: this.form.controls.disminucionProteccion.value,
      requisitosMedicos: this.form.controls.requisitosMedicos.value,
      facturacion: this.form.controls.tieneFacturacion.value,
      tieneProyeccion: this.form.controls.tieneProyeccion.value,
      tieneEstadistica: this.form.controls.tieneEstadistica.value,

      // Condiciones destinacion
      disponibleParaGarantia: this.form.controls.disponibleGarantia.value,

      // Condiciones movimientos
      aplicaReactivacion: this.form.controls.aplicaReactivacion.value,
      aplicaRevocatoria: this.form.controls.aplicaRevocatoria.value,
      aplicaHabilitacion: this.form.controls.aplicaHabilitacion.value,
      aplicaReceso: this.form.controls.aplicaReceso.value,
      aplicaReingreso: this.form.controls.aplicaReingreso.value,

      // Condiciones indemnizacion
      cancelar: this.form.controls.puedeCancelar.value,
      devolucionRetiro: this.form.controls.devolucionRetiro.value,
      prorroga: this.form.controls.prorroga.value,
      rescate: this.form.controls.tieneRescate.value,
      exoneracionPago: this.form.controls.exoneracionPago.value,
      beneficiarios: this.form.controls.beneficiarios.value,
      aplicaSubsistencia: this.form.controls.aplicaSubsistencia.value,
      aplicaDisminucionPorAnticipoPago: this.form.controls.aplicaDisminucionPorAnticipoPago.value,
      beneficiosPorPreexistencia: this.form.controls.beneficiosPorPreexistencia.value,
      reconocimientoPermanencia: this.form.controls.reconocimientoPermanencia.value,
    };

    this.backService.cobertura.guardarCobertura(cobertura).subscribe((_cobertura: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar clientes.
          this._irACoberturas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irACoberturas() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS]);
  }

  private obtenerCliente(fondo: any) {
    return this.clientes.find(item => item.codigo === fondo.mimCliente.codigo);
  }

  private obtenerUnidadTiempo(codigo: any) {
    return this.unidadesEventos ? this.unidadesEventos.find(unidadTiempo => unidadTiempo.codigo === codigo) : null;
  }

  private obtenerFondo(codigo: any) {
    return this.fondos ? this.fondos.find(fondo => fondo.codigo === codigo) : null;
  }

  private obtenerEstadoCobertura(codigo: any) {
    return this.estados ? this.estados.find(estado => estado.codigo === codigo) : null;
  }

  private obtenerOrigenCobertura(codigoList: any) {
    return this.origenes.filter(origen => codigoList.find(item => item.codigo === origen.codigo));
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.form && !this.isPristine(this.form) && this.form.dirty;
  }

  _onCoberturaBasica($event) {
    if ($event.currentTarget.name === 'asistencia' && $event.currentTarget.checked) {
      this._valueControles();
      this._estadoControles(false);
    } else if ($event.currentTarget.name === 'asistencia' && !$event.currentTarget.checked) {
      this._estadoControles(false);
    }
  }

  _valueControles() {

    // Condiciones Venta
    this.form.controls.planFamiliar.setValue(false);
    this.form.controls.renunciarAmparo.setValue(false);
    this.form.controls.incremento.setValue(false);
    this.form.controls.disminucionProteccion.setValue(false);
    this.form.controls.requisitosMedicos.setValue(false);
    this.form.controls.tieneFacturacion.setValue(false);
    this.form.controls.tieneProyeccion.setValue(false);
    this.form.controls.tieneEstadistica.setValue(false);

    // Condiciones destinacion
    this.form.controls.disponibleGarantia.setValue(false);

    // Condiciones movimientos
    this.form.controls.aplicaReactivacion.setValue(false);
    this.form.controls.aplicaRevocatoria.setValue(false);
    this.form.controls.aplicaHabilitacion.setValue(false);
    this.form.controls.aplicaReceso.setValue(false);
    this.form.controls.aplicaReingreso.setValue(false);

    // Condiciones indemnizacion
    this.form.controls.puedeCancelar.setValue(false);
    this.form.controls.devolucionRetiro.setValue(false);
    this.form.controls.prorroga.setValue(false);
    this.form.controls.tieneRescate.setValue(false);
    this.form.controls.exoneracionPago.setValue(false);
    this.form.controls.beneficiarios.setValue(false);
    this.form.controls.aplicaSubsistencia.setValue(false);
    this.form.controls.aplicaDisminucionPorAnticipoPago.setValue(false);
    this.form.controls.beneficiosPorPreexistencia.setValue(false);
    this.form.controls.reconocimientoPermanencia.setValue(false);
  }

  _estadoControles(estado: boolean) {
    if (estado) {
      // Condiciones Venta
      this.form.controls.planFamiliar.disable();
      this.form.controls.renunciarAmparo.disable();
      this.form.controls.incremento.disable();
      this.form.controls.disminucionProteccion.disable();
      this.form.controls.requisitosMedicos.disable();
      this.form.controls.tieneFacturacion.disable();
      this.form.controls.tieneProyeccion.disable();
      this.form.controls.tieneEstadistica.disable();

      // Condiciones destinacion
      this.form.controls.disponibleGarantia.disable();

      // Condiciones movimientos
      this.form.controls.aplicaReactivacion.disable();
      this.form.controls.aplicaRevocatoria.disable();
      this.form.controls.aplicaHabilitacion.disable();
      this.form.controls.aplicaReceso.disable();
      this.form.controls.aplicaReingreso.disable();

      // Condiciones indemnizacion
      this.form.controls.puedeCancelar.disable();
      this.form.controls.devolucionRetiro.disable();
      this.form.controls.prorroga.disable();
      this.form.controls.tieneRescate.disable();
      this.form.controls.exoneracionPago.disable();
      this.form.controls.beneficiarios.disable();
      this.form.controls.aplicaSubsistencia.disable();
      this.form.controls.aplicaDisminucionPorAnticipoPago.disable();
      this.form.controls.beneficiosPorPreexistencia.disable();
      this.form.controls.reconocimientoPermanencia.disable();

    } else {
      // Condiciones Venta
      this.form.controls.planFamiliar.enable();
      this.form.controls.renunciarAmparo.enable();
      this.form.controls.incremento.enable();
      this.form.controls.disminucionProteccion.enable();
      this.form.controls.requisitosMedicos.enable();
      this.form.controls.tieneFacturacion.enable();
      this.form.controls.tieneProyeccion.enable();
      this.form.controls.tieneEstadistica.enable();

      // Condiciones destinacion
      this.form.controls.disponibleGarantia.enable();

      // Condiciones movimientos
      this.form.controls.aplicaReactivacion.enable();
      this.form.controls.aplicaRevocatoria.enable();
      this.form.controls.aplicaHabilitacion.enable();
      this.form.controls.aplicaReceso.enable();
      this.form.controls.aplicaReingreso.enable();

      // Condiciones indemnizacion
      this.form.controls.puedeCancelar.enable();
      this.form.controls.devolucionRetiro.enable();
      this.form.controls.prorroga.enable();
      this.form.controls.tieneRescate.enable();
      this.form.controls.exoneracionPago.enable();
      this.form.controls.beneficiarios.enable();
      this.form.controls.aplicaSubsistencia.enable();
      this.form.controls.aplicaDisminucionPorAnticipoPago.enable();
      this.form.controls.beneficiosPorPreexistencia.enable();
      this.form.controls.reconocimientoPermanencia.enable();
    }
  }

  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    const _datos = {
      ...datos,
      codigoCobertura: this.codigoCobertura,
      codigoSolicitudPadre: GENERALES.CODIGO_SOLICITUD_PADRE,
      codigoSolicitud: this.codigoCobertura.toString(),
      nombreSolicitud: this.form.controls.nombre.value,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_ELIMINAR_COBERTURA,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_ELIMINAR_COBERTURA
    };

    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.ELIMINAR_COBERTURA, _datos).subscribe((resp: any) => {
      this.translate.get('global.solicitudEliminacionEnviada').subscribe((getMensaje: string) => {
        this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: resp }).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje).then(() => {
            this.router.navigate([
              UrlRoute.PAGES,
              UrlRoute.ADMINISTRACION,
              UrlRoute.ADMINSTRACION_PROTECCIONES,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
              UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS
            ]);
          });
        });
      });


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
      this.router.navigate([
        UrlRoute.PAGES,
        UrlRoute.ADMINISTRACION,
        UrlRoute.ADMINSTRACION_PROTECCIONES,
        UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
        UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_COBERTURAS
      ]);
    }
  }

  _mensajeSolicitudEliminacion(codigo: any) {
    this.translate.get('administracion.protecciones.coberturas.alertas.deseaEliminarCobertura').subscribe((getMensaje: string) => {
      this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: codigo }).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });
    });
  }
}
