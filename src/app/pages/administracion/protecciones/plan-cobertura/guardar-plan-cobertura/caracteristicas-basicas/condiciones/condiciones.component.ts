import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { Subscription } from 'rxjs/internal/Subscription';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimCondicion, MimCondicion } from '../../../model/mim-condicion.model';
import { PostCondicionesAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionAnteriorPorId, obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { CondicionesConfig } from './condiciones.config';

@Component({
  selector: 'app-condiciones',
  templateUrl: './condiciones.component.html'
})
export class CondicionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  // Id de la seccion
  id = 'condiciones';
  planCobertura: GuardarPlanCobertura;
  planCoberturaResponse;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: CondicionesConfig = new CondicionesConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  condicion: any;

  estadoFecha: boolean;
  estado = true;

  nombrePlan: any;
  nombreCobertura: any;

  coberturasSubsistentes: any[] = [];
  coberturasAdicionales: any[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  async ngOnInit() {

    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this._listar(codigoPlanCobertura);
      }
    }));

    // Cargamos los datos luego de que los componentes visuales se hayan cargado para evitar errores.
    // El componente de la grilla/tabla se utiliza en este scope y para usarse la tabla debe estar renderizada.
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }

        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.condiciones);
      }));

    if (this.planCobertura && this.planCobertura.planCobertura) {
      const _cobertura = this.planCobertura.planCobertura.mimCobertura;
      const _plan = this.planCobertura.planCobertura.mimPlan;
      if (!(_cobertura && _cobertura.nombre) || !(_plan && _plan.nombre)) { return; }
      this.nombrePlan = _plan.nombre;
      this.nombreCobertura = _cobertura.nombre;
      this.planCoberturaResponse = this.planCobertura.planCobertura;
    }
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        // Condiciones venta
        aplicaPlanFamiliar: new FormControl(param ? param.aplicaPlanFamiliar : false, [Validators.required]),
        renunciaAmparo: new FormControl(param ? param.renunciaAmparo : false, [Validators.required]),
        incrementoProteccion: new FormControl(param ? param.incrementoProteccion : false, [Validators.required]),
        disminucionProteccion: new FormControl(param ? param.disminucionProteccion : false, [Validators.required]),
        requisitosMedicos: new FormControl(param ? param.requisitosMedicos : false, [Validators.required]),
        facturacion: new FormControl(param ? param.facturacion : false, [Validators.required]),
        tieneProyeccion: new FormControl(param ? param.tieneProyeccion : false, [Validators.required]),
        tieneEstadistica: new FormControl(param ? param.tieneEstadistica : false, [Validators.required]),

        // Condiciones destinacion
        disponibleParaGarantia: new FormControl(param ? param.disponibleParaGarantia : false, [Validators.required]),

        // Condiciones movimientos
        aplicaReactivacion: new FormControl(param ? param.aplicaReactivacion : false, [Validators.required]),
        aplicaRevocatoria: new FormControl(param ? param.aplicaRevocatoria : false, [Validators.required]),
        aplicaHabilitacion: new FormControl(param ? param.aplicaHabilitacion : false, [Validators.required]),
        aplicaReceso: new FormControl(param ? param.aplicaReceso : false, [Validators.required]),
        aplicaReingreso: new FormControl(param ? param.aplicaReingreso : false, [Validators.required]),

        // Condiciones indemnizacion
        cancelar: new FormControl(param ? param.cancelar : false, [Validators.required]),
        devolucionRetiro: new FormControl(param ? param.devolucionRetiro : false, [Validators.required]),
        prorroga: new FormControl(param ? param.prorroga : false, [Validators.required]),
        rescate: new FormControl(param ? param.rescate : false, [Validators.required]),
        exoneracionPago: new FormControl(param ? param.exoneracionPago : false, [Validators.required]),
        aplicaSubsistencia: new FormControl(param ? param.aplicaSubsistencia : false, [Validators.required]),
        disminucionAnticipoPago: new FormControl(param ? param.disminucionAnticipoPago : false, [Validators.required]),
        beneficiosPreexistencia: new FormControl(param ? param.beneficiosPreexistencia : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])

      })
    );

    this.estadoFecha = this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.estadoFecha) {
      this.form.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }

    if (param && !param.estado && !this.estadoFecha) {
      this.form.disable();
      this.estadoFecha = param !== undefined && param !== null && !param.estado;
    }

    this.obtenerValoresCoberturaChecks();
  }

  obtenerValoresCoberturaChecks() {
    if (this._esCreacion) {
      if (this.planCoberturaResponse.mimCobertura.aplicaDisminucionPorAnticipoPago) {
        this.form.controls.disminucionAnticipoPago.setValue(true);
      } else {
        this.form.controls.disminucionAnticipoPago.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaHabilitacion) {
        this.form.controls.aplicaHabilitacion.setValue(true);
      } else {
        this.form.controls.aplicaHabilitacion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaPlanFamiliar) {
        this.form.controls.aplicaPlanFamiliar.setValue(true);
      } else {
        this.form.controls.aplicaPlanFamiliar.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaReactivacion) {
        this.form.controls.aplicaReactivacion.setValue(true);
      } else {
        this.form.controls.aplicaReactivacion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaReceso) {
        this.form.controls.aplicaReceso.setValue(true);
      } else {
        this.form.controls.aplicaReceso.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaReingreso) {
        this.form.controls.aplicaReingreso.setValue(true);
      } else {
        this.form.controls.aplicaReingreso.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaRevocatoria) {
        this.form.controls.aplicaRevocatoria.setValue(true);
      } else {
        this.form.controls.aplicaRevocatoria.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.aplicaSubsistencia) {
        this.form.controls.aplicaSubsistencia.setValue(true);
      } else {
        this.form.controls.aplicaSubsistencia.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.beneficiosPorPreexistencia) {
        this.form.controls.beneficiosPreexistencia.setValue(true);
      } else {
        this.form.controls.beneficiosPreexistencia.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.cancelar) {
        this.form.controls.cancelar.setValue(true);
      } else {
        this.form.controls.cancelar.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.devolucionRetiro) {
        this.form.controls.devolucionRetiro.setValue(true);
      } else {
        this.form.controls.devolucionRetiro.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.disminucionProteccion) {
        this.form.controls.disminucionProteccion.setValue(true);
      } else {
        this.form.controls.disminucionProteccion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.disponibleParaGarantia) {
        this.form.controls.disponibleParaGarantia.setValue(true);
      } else {
        this.form.controls.disponibleParaGarantia.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.exoneracionPago) {
        this.form.controls.exoneracionPago.setValue(true);
      } else {
        this.form.controls.exoneracionPago.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.facturacion) {
        this.form.controls.facturacion.setValue(true);
      } else {
        this.form.controls.facturacion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.tieneProyeccion) {
        this.form.controls.tieneProyeccion.setValue(true);
      } else {
        this.form.controls.tieneProyeccion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.tieneEstadistica) {
        this.form.controls.tieneEstadistica.setValue(true);
      } else {
        this.form.controls.tieneEstadistica.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.incrementoProteccion) {
        this.form.controls.incrementoProteccion.setValue(true);
      } else {
        this.form.controls.incrementoProteccion.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.renunciaAmparo) {
        this.form.controls.renunciaAmparo.setValue(true);
      } else {
        this.form.controls.renunciaAmparo.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.requisitosMedicos) {
        this.form.controls.requisitosMedicos.setValue(true);
      } else {
        this.form.controls.requisitosMedicos.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.prorroga) {
        this.form.controls.prorroga.setValue(true);
      } else {
        this.form.controls.prorroga.setValue(false);
      }

      if (this.planCoberturaResponse.mimCobertura.rescate) {
        this.form.controls.rescate.setValue(true);
      } else {
        this.form.controls.rescate.setValue(false);
      }
    }
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  async _toggle() {
    // Validamos que la seccion anterior este guardado.
    const seccionAnterior = obtenerSeccionAnteriorPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    if (seccionAnterior && (!seccionAnterior.estado || seccionAnterior.estado === Estado.Pendiente)) {
      const seccionAnteriorTitle = await this.translate.get(seccionAnterior.title).toPromise();
      const seccionTitle = await this.translate.get(seccion.title).toPromise();
      const mensaje = await this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.debeCompletarSeccionAnterior',
        {
          anterior: seccionAnteriorTitle,
          seccion: seccionTitle
        }).toPromise();
      this.frontService.alert.info(mensaje);
      return;
    }

    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });

      this._cerrarSeccion();
    }
  }

  _onClickCelda($event) {
    this._toggleGuardar(true, $event);
  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  async _toggleGuardar(toggle: boolean, condicion?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {

      if (condicion) {
        this.condicion = JSON.parse(JSON.stringify(condicion));
        this._esCreacion = false;
        this.initForm(this.condicion);
      } else {
        this.condicion = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion && seccion.estado ? seccion.estado : Estado.Pendiente;
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.condicion = undefined;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.condicion.obtenerCondiciones({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {
      this.configuracion.gridConfig.component.limpiar();
      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostCondicionesAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay condiciones al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostCondicionesAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private _cargarDatosTabla(page: Page<MimCondicion>) {
    if (!page || !page.content || page.content.length === 0) {
      return;
    }

    if (this.configuracion.gridConfig.component) {
      this.configuracion.gridConfig.component.limpiar();
      this.configuracion.gridConfig.component.cargarDatos(
        this._asignarEstados(page.content), {
        maxPaginas: page.totalPages,
        pagina: page.number,
        cantidadRegistros: page.totalElements
      });
    }
  }

  _asignarEstados(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        _estado: item.estado ? 'Si' : 'No'
      });
    }

    return listObj;
  }

  _guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
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

  _crear() {
    const condicion = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      // Condiciones venta
      aplicaPlanFamiliar: this.form.controls.aplicaPlanFamiliar.value,
      renunciaAmparo: this.form.controls.renunciaAmparo.value,
      incrementoProteccion: this.form.controls.incrementoProteccion.value,
      disminucionProteccion: this.form.controls.disminucionProteccion.value,
      requisitosMedicos: this.form.controls.requisitosMedicos.value,
      facturacion: this.form.controls.facturacion.value,
      tieneProyeccion: this.form.controls.tieneProyeccion.value,
      tieneEstadistica: this.form.controls.tieneEstadistica.value,

      // Condiciones destinacion
      disponibleParaGarantia: this.form.controls.disponibleParaGarantia.value,

      // Condiciones movimientos
      aplicaReactivacion: this.form.controls.aplicaReactivacion.value,
      aplicaRevocatoria: this.form.controls.aplicaRevocatoria.value,
      aplicaHabilitacion: this.form.controls.aplicaHabilitacion.value,
      aplicaReceso: this.form.controls.aplicaReceso.value,
      aplicaReingreso: this.form.controls.aplicaReingreso.value,

      // Condiciones indemnizacion
      cancelar: this.form.controls.cancelar.value,
      devolucionRetiro: this.form.controls.devolucionRetiro.value,
      prorroga: this.form.controls.prorroga.value,
      rescate: this.form.controls.rescate.value,
      exoneracionPago: this.form.controls.exoneracionPago.value,
      aplicaSubsistencia: this.form.controls.aplicaSubsistencia.value,
      disminucionAnticipoPago: this.form.controls.disminucionAnticipoPago.value,
      beneficiosPreexistencia: this.form.controls.beneficiosPreexistencia.value,

      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: true
    } as IMimCondicion;

    this.backService.condicion.crearCondicion(condicion).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.condicion = undefined;
      this.mostrarGuardar = false;

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.planCobertura.planCobertura.codigo);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  async _actualizar() {

    // Condiciones Venta
    this.condicion.aplicaPlanFamiliar = this.form.controls.aplicaPlanFamiliar.value;
    this.condicion.renunciaAmparo = this.form.controls.renunciaAmparo.value;
    this.condicion.incrementoProteccion = this.form.controls.incrementoProteccion.value;
    this.condicion.disminucionProteccion = this.form.controls.disminucionProteccion.value;
    this.condicion.requisitosMedicos = this.form.controls.requisitosMedicos.value;
    this.condicion.facturacion = this.form.controls.facturacion.value;
    this.condicion.tieneProyeccion = this.form.controls.tieneProyeccion.value;
    this.condicion.tieneEstadistica = this.form.controls.tieneEstadistica.value;

    // Condiciones destinacion
    this.condicion.disponibleParaGarantia = this.form.controls.disponibleParaGarantia.value;

    // Condiciones movimientos
    this.condicion.aplicaReactivacion = this.form.controls.aplicaReactivacion.value;
    this.condicion.aplicaRevocatoria = this.form.controls.aplicaRevocatoria.value;
    this.condicion.aplicaHabilitacion = this.form.controls.aplicaHabilitacion.value;
    this.condicion.aplicaReceso = this.form.controls.aplicaReceso.value;
    this.condicion.aplicaReingreso = this.form.controls.aplicaReingreso.value;

    // Condiciones indemnizacion
    this.condicion.cancelar = this.form.controls.cancelar.value;
    this.condicion.devolucionRetiro = this.form.controls.devolucionRetiro.value;
    this.condicion.prorroga = this.form.controls.prorroga.value;
    this.condicion.rescate = this.form.controls.rescate.value;
    this.condicion.exoneracionPago = this.form.controls.exoneracionPago.value;
    this.condicion.aplicaSubsistencia = this.form.controls.aplicaSubsistencia.value;
    this.condicion.disminucionAnticipoPago = this.form.controls.disminucionAnticipoPago.value,
      this.condicion.beneficiosPreexistencia = this.form.controls.beneficiosPreexistencia.value,
      this.condicion.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.condicion.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');

    // Se verifica si el plan-cobertura tiene subsistencias o coberturas adicionales para modificar la fechaFin en caso se actualizarse a No
    if (!this.form.controls.aplicaSubsistencia.value) {
      // Logica para coberturas subsistentes
      const coberturasSubsistentes = await this.backService.subsistentePlanCobertura.getSubsistentesPlanesCoberturas({}).toPromise();
      this.coberturasSubsistentes = coberturasSubsistentes.content;
      this.coberturasSubsistentes = this.coberturasSubsistentes.filter(item => item.mimPlanCobertura.mimPlan.codigo === this.planCobertura.planCobertura.mimPlan.codigo && item.mimCoberturaIndemnizada.codigo === this.planCobertura.planCobertura.mimCobertura.codigo && item.estado === true);
      // Logica para coberturas adicionales
      const coberturasAdicionales = await this.backService.adicionalPlanCobertura.getAdicionalPlanesCoberturas({}).toPromise();
      this.coberturasAdicionales = coberturasAdicionales.content;
      this.coberturasAdicionales = this.coberturasAdicionales.filter(item => item.mimPlanCobertura.mimPlan.codigo === this.planCobertura.planCobertura.mimPlan.codigo && item.mimCoberturaIndemnizada.codigo === this.planCobertura.planCobertura.mimCobertura.codigo && item.estado === true);

      if (this.coberturasSubsistentes != null && this.coberturasSubsistentes.length > 0 || this.coberturasAdicionales != null && this.coberturasAdicionales.length > 0) {
        this.translate.get('administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.condiciones.alert.cambioCheckAplicaSubsistente').subscribe((mensaje: string) => {
          this.frontService.alert.confirm(mensaje, 'danger').then((desition: any) => {
            if (desition === true) {
              this.backService.condicion.actualizarCondicion(this.condicion.codigo, this.condicion).subscribe((respuesta: any) => {
                // Limpiamos el formulario.
                this.limpiarFormulario();
                // Cerramos el modal.
                this.condicion = undefined;
                this.mostrarGuardar = false;

                this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
                  this.frontService.alert.success(text).then(() => {
                    // Recargamos la informacion de la tabla.
                    this._listar(this.planCobertura.planCobertura.codigo);
                  });
                });
              }, (err) => {
                this.frontService.alert.error(err.error.message);
              });
            }
          });
        });
      } else {
        this.backService.condicion.actualizarCondicion(this.condicion.codigo, this.condicion).subscribe((respuesta: any) => {
          // Limpiamos el formulario.
          this.limpiarFormulario();
          // Cerramos el modal.
          this.condicion = undefined;
          this.mostrarGuardar = false;

          this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
            this.frontService.alert.success(text).then(() => {
              // Recargamos la informacion de la tabla.
              this._listar(this.planCobertura.planCobertura.codigo);
            });
          });
        }, (err) => {
          this.frontService.alert.error(err.error.message);
        });
      }
    } else {
      this.backService.condicion.actualizarCondicion(this.condicion.codigo, this.condicion).subscribe((respuesta: any) => {
        // Limpiamos el formulario.
        this.limpiarFormulario();
        // Cerramos el modal.
        this.condicion = undefined;
        this.mostrarGuardar = false;

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this._listar(this.planCobertura.planCobertura.codigo);
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
    }


  }

}
