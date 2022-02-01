import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MimGridComponent } from '@shared/components/mim-grid/mim-grid.component';
import { Page } from '@shared/interfaces/page.interface';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { PostCoberturaSusbsistenteAction } from '../../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../../plan-cobertura.reducer';
import { CoberturasSubsistentesConfig } from './coberturas-subsistentes.config';

@Component({
  selector: 'app-coberturas-subsistentes',
  templateUrl: './coberturas-subsistentes.component.html'
})
export class CoberturasSubsistentesComponent extends FormValidate implements OnInit, OnDestroy, AfterViewInit, FormComponent {
  /** Id de la seccion */
  idCoberturasSubsistentes = 'coberturasSubsistentes';
  idCoberturasAdicionales = 'coberturasAdicionales';

  codiPlancoberturaa: any;
  codigoCoberturaa: any;

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  cabeceraForm: FormGroup;
  isCabeceraForm: Promise<any>;
  detalleForm: FormGroup;
  isDetalleForm: Promise<any>;
  adicionalForm: FormGroup;
  isAdicionalForm: Promise<any>;
  _esCreacion: boolean;
  _esCreacionDetalle: boolean;

  coberturasIndemnizadasProceso: any[] = [];
  condiciones: any[];
  condicionValidarEstado: any;
  coberturasSubsistentes: any[];
  coberturasAdicionales: any[];
  coberturasIndemnizadas: any;
  coberturasIndemnizadasPlanCobertura: any[] = [];
  tiposSubsistencias: any[] = [];
  vigenciaFechasAMantenerSeleccionadas: Date[];
  planes: any[] = [];
  planActualizar: any[] = [];
  planEditarCobIndemnizada;

  configuracion: CoberturasSubsistentesConfig = new CoberturasSubsistentesConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;

  subsistentePlanCobertura: any;
  subsistentePlanCoberturaDetalle: any;


  nombrePlan: any;
  nombreCobertura: any;

  estado = true;
  estadoFecha: boolean;
  hayDatosGridSubsitentes: boolean;


  @ViewChild('gridDetalle')
  set gridDetalle(gridDetalle: MimGridComponent) {
    setTimeout(() => {
      if (!gridDetalle) {
        return;
      }

      // Limpiamos siempre la tabla antes de cargar los nuevos datos.
      gridDetalle.limpiar();
      this._cargarDatosTablaDetalle(this.subsistentePlanCobertura.mimSubsistentePlanCoberturaDetalleList,
        gridDetalle);
    });
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.hayDatosGridSubsitentes = false;
  }

  ngOnInit() {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura;
      this.codiPlancoberturaa = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
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

        this._cargarDatosTabla(this.planCobertura.subsistentePlanCobertura);


        // Debemos ademas intentar actualizar la tabla del modal de creacion/actualizacion.
        if (this.subsistentePlanCobertura) {
          const _mimSubsistentePlanCobertura = Object(this.planCobertura.subsistentePlanCobertura.content)
            .find(mimSubsistentePlanCobertura =>
              mimSubsistentePlanCobertura.codigo === this.subsistentePlanCobertura.codigo);
          this.subsistentePlanCobertura = _mimSubsistentePlanCobertura;
          if (this.subsistentePlanCobertura.mimSubsistentePlanCoberturaDetalleList) {
            this._cargarDatosTablaDetalle(this.subsistentePlanCobertura.mimSubsistentePlanCoberturaDetalleList,
              this.configuracion.gridDetalleConfig.component);
          }

        }
      }));
  }

  private _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.subsistentePlanCoberturaDetalle = undefined;
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  hasChanges() {
    return (this.cabeceraForm && this.cabeceraForm.dirty) || (this.detalleForm && this.detalleForm.dirty) || (this.adicionalForm && this.adicionalForm.dirty);
  }

  ngAfterViewInit() {
    // do nothing
  }


  // Listar para las coberturas subsistentes
  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.subsistentePlanCobertura.getSubsistentesPlanesCoberturas({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (!this.hayDatosGridSubsitentes) {
          if (estado === 'true') {
            this.store.dispatch(new PostCoberturaSusbsistenteAction(page, this.idCoberturasSubsistentes, Estado.Pendiente));
          }
        }
        return;
      }
      this.hayDatosGridSubsitentes = true;

      // Informamos que ya hay coberturas subsistentes al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostCoberturaSusbsistenteAction(page, this.idCoberturasSubsistentes, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  validarEstadoAdicional(items: any) {
    return items.find(objec => objec.estado === true);
  }

  // Estructura para cargar datos coberturas subsistentes
  private _cargarDatosTabla(page: Page<any>) {
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

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event);
    } else {
      this._alEliminar($event.dato);
    }
  }

  private _alEliminar($event: any) {
    const coberturaSubsistente = $event.mimCoberturaIndemnizada;
    const plan = $event.mimPlan.codigo;
    this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.deseaEliminarRow').subscribe((mensaje: string) => {
      const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
      const newObservable = from(modalPromise);

      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this._eliminar(coberturaSubsistente.codigo, plan);
          }
        });
    });
  }

  private _eliminar(codigo: string, plan: any) {
    this.backService.subsistentePlanCobertura.deleteSubsistentePlanCobertura(codigo, plan, this.planCobertura.planCobertura.codigo).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });

      this._listar(this.planCobertura.planCobertura.codigo);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.idCoberturasSubsistentes, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }


  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  // Estructura para Iniciar el proceso de formularios para crear coberturas subsistentes
  async _toggleGuardar(toggle: boolean, subsistentePlanCobertura?: any) {

    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormularioDetalle();
        }
      });
    } else {
      // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      await this._cargarDatosDesplegables();

      if (subsistentePlanCobertura) {
        this.subsistentePlanCobertura = JSON.parse(JSON.stringify(subsistentePlanCobertura)).dato;
        this._esCreacion = false;
        await this.desplegarCoberturasSegunPlanSeleccionado(this.subsistentePlanCobertura.mimPlan.codigo);
        this.initCabeceraForm(this.subsistentePlanCobertura);
        this._esCreacionDetalle = false;
        await this.cargarCondicion(this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo);
        this.initDetalleForm();
      } else {
        this.subsistentePlanCobertura = undefined;
        this._esCreacion = true;
        this.initCabeceraForm();
        this._esCreacionDetalle = true;
        this.initDetalleForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  async cargarCondicion(codigo: any) {
    this.condicionValidarEstado = null;
    const planCobertura = this.obtenerCoberturaIndemnizada(codigo);
    const _condiciones = await this.backService.condicion.obtenerCondiciones({
      'mimPlanCobertura.codigo': planCobertura.codigo
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.condicionValidarEstado = _condiciones.content;
  }

  private async _cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    // Lista de planes
    const _planes = await this.backService.planes.getPlanes({
      'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO]
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.planes = _planes.content;

    const _tiposSubsistentes = await this.backService.tipoSubsistente.getTiposSubsistentes({ estado: true, sort: 'nombre.desc' }).toPromise();
    this.tiposSubsistencias = _tiposSubsistentes._embedded.mimTipoSubsistencia;

  }

  private limpiarFormularioCabecera(param?: any) {
    this.cabeceraForm.reset();
    this.initCabeceraForm(param);
  }

  _guardarCabecera() {
    if (this.cabeceraForm.invalid) {
      this.validateForm(this.cabeceraForm);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crearCabecera();
    } else {
      this._actualizarCabecera();
    }
  }

  _crearCabecera() {
    const mimSubsistentePlanCobertura = {
      mimPlan: { codigo: this.cabeceraForm.controls.plan.value.codigo },
      mimCoberturaIndemnizada: { codigo: this.cabeceraForm.controls.coberturaIndemnizada.value.mimCobertura.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: this.cabeceraForm.controls.vigente.value,
      mimSubsistentePlanCoberturaDetalleList: []
    };

    this.backService.subsistentePlanCobertura.postSubsistentePlanCobertura(mimSubsistentePlanCobertura).subscribe((respuesta: any) => {
      // Transformamos a edicion
      this.subsistentePlanCobertura = respuesta;
      this._esCreacion = false;
      this.cabeceraForm.controls.vigente.enable();
      this.limpiarFormularioCabecera(this.subsistentePlanCobertura);

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this.mostrarGuardar = false;
          this.subsistentePlanCobertura = undefined;
          this._listar(this.planCobertura.planCobertura.codigo);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizarCabecera() {
    const mimSubsistentePlanCobertura = {
      mimPlan: { codigo: this.cabeceraForm.controls.plan.value.codigo },
      mimCoberturaIndemnizada: { codigo: this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: this.cabeceraForm.controls.vigente.value
    };

    this.backService.subsistentePlanCobertura.putSubsistentePlanCobertura(
      this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo,
      this.cabeceraForm.controls.plan.value.codigo,
      this.planCobertura.planCobertura.codigo,
      mimSubsistentePlanCobertura).subscribe((respuesta: any) => {
        this.subsistentePlanCobertura = respuesta;
        this.limpiarFormularioCabecera(this.subsistentePlanCobertura);

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            // Recargamos la informacion de la tabla.
            this.mostrarGuardar = false;
            this.subsistentePlanCobertura = undefined;
            this._listar(this.planCobertura.planCobertura.codigo);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  private _cargarDatosTablaDetalle(content: any[], gridDetalle: MimGridComponent) {
    if (!content || content.length === 0) {
      return;
    }

    if (gridDetalle) {
      gridDetalle.limpiar();
      gridDetalle.cargarDatos(
        this._asignarEstados(content), {
        maxPaginas: Math.ceil(content.length / 10),
        pagina: 0,
        cantidadRegistros: content.length
      });
    }
  }

  _onClickCeldaDetalle($event) {
    if (!this.subsistentePlanCobertura) {
      return;
    }

    this._esCreacionDetalle = false;

    this.subsistentePlanCoberturaDetalle = $event;
    if (!this.subsistentePlanCoberturaDetalle.mimTipoSubsistencia) {
      this.initDetalleFormUpdate($event);
    } else {
      this.initDetalleForm($event);
    }
  }

  private initDetalleForm(param?: any) {
    this.isDetalleForm = Promise.resolve(
      this.detalleForm = this.formBuilder.group({
        tipoSubsistencia: new FormControl(param ? this.obtenerTipoSubsistencia(param.mimTipoSubsistencia.codigo) : null),
        subsistenteCobertura: new FormControl(param ? param.subsistente : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigenteDetalle: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    if (this.detalleForm.controls.subsistenteCobertura.value === true) {
      this.detalleForm.controls.tipoSubsistencia.enable();
      this.detalleForm.controls.tipoSubsistencia.setErrors({ 'required': true });
    } else {
      this.detalleForm.controls.tipoSubsistencia.disable();
      this.detalleForm.controls.tipoSubsistencia.setValue(null);
    }
    this._onChangeSubsistenteCobertura();

    this.estadoFecha = this.subsistentePlanCobertura
      && !this.subsistentePlanCobertura.estado
      || this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.estadoFecha) {
      this.detalleForm.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacionDetalle) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.validarDisponibilidadEstadoSubsistente();
    }
  }

  validarDisponibilidadEstadoSubsistente() {
    const _condicion = this.condicionValidarEstado[0];
    if (!_condicion.aplicaSubsistencia) {
      this.detalleForm.controls.vigenteDetalle.disable();
    }
  }
  private initDetalleFormUpdate(param?: any) {
    this.isDetalleForm = Promise.resolve(
      this.detalleForm = this.formBuilder.group({
        tipoSubsistencia: new FormControl(null),
        subsistenteCobertura: new FormControl(param ? param.subsistente : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigenteDetalle: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    if (this.detalleForm.controls.subsistenteCobertura.value === true) {
      this.detalleForm.controls.tipoSubsistencia.enable();
      this.detalleForm.controls.tipoSubsistencia.setErrors({ 'required': true });
    } else {
      this.detalleForm.controls.tipoSubsistencia.disable();
      this.detalleForm.controls.tipoSubsistencia.setValue(null);
    }
    this._onChangeSubsistenteCobertura();

    this.estadoFecha = this.subsistentePlanCobertura
      && !this.subsistentePlanCobertura.estado
      || this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.estadoFecha) {
      this.detalleForm.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacionDetalle) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }
  }

  _onChangeSubsistenteCobertura() {
    this.detalleForm.controls.subsistenteCobertura.valueChanges.subscribe(subsistenteCobertur => {
      if (subsistenteCobertur) {
        this.detalleForm.controls.tipoSubsistencia.enable();
        this.detalleForm.controls.tipoSubsistencia.setErrors({ 'required': true });
      } else {
        this.detalleForm.controls.tipoSubsistencia.disable();
        this.detalleForm.controls.tipoSubsistencia.setValue(null);
      }
    });
  }

  private obtenerCoberturaIndemnizada(codigo: string) {
    return this.coberturasIndemnizadas.find(coberturaIndemnizada => coberturaIndemnizada.mimCobertura.codigo === codigo);
  }

  private obtenerPlanSelected(codigo: any) {
    return this.planes.find(planesItem => planesItem.codigo === codigo);
  }

  private obtenerTipoSubsistencia(codigo: string) {
    return this.tiposSubsistencias.find(tipoSubsistencia => tipoSubsistencia.codigo === codigo);
  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  limpiarFormularioDetalle() {
    this.subsistentePlanCoberturaDetalle = undefined;
    this._esCreacionDetalle = true;
    this.detalleForm.reset();
    this.initDetalleForm();
  }

  _guardarDetalle() {
    if (this.detalleForm.invalid) {
      this.validateForm(this.detalleForm);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacionDetalle) {
      this._crearDetalle();
    } else {
      this._actualizarDetalle();
    }
  }

  private _crearDetalle() {
    let detalle = [];
    detalle = [{
      mimTipoSubsistencia: this.detalleForm.controls.tipoSubsistencia.value ? { codigo: this.detalleForm.controls.tipoSubsistencia.value.codigo } : null,
      subsistente: this.detalleForm.controls.subsistenteCobertura.value,
      estado: this.detalleForm.controls.vigenteDetalle.value,
      fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    }];

    const mimSubsistentePlanCobertura = {
      mimPlan: { codigo: this.subsistentePlanCobertura.mimPlan.codigo },
      mimCoberturaIndemnizada: { codigo: this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: true,
      mimSubsistentePlanCoberturaDetalleList: detalle
    };

    this.backService.subsistentePlanCobertura.putSubsistentePlanCobertura(
      this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo,
      this.subsistentePlanCobertura.mimPlan.codigo,
      this.planCobertura.planCobertura.codigo,
      mimSubsistentePlanCobertura).subscribe((respuesta: any) => {
        this.subsistentePlanCobertura = respuesta;
        // Limpiamos el formulario.
        this.limpiarFormularioDetalle();

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

  private _actualizarDetalle() {
    let detalle = [];
    detalle = [{
      codigo: this.subsistentePlanCoberturaDetalle ? this.subsistentePlanCoberturaDetalle.codigo : null,
      mimTipoSubsistencia: this.detalleForm.controls.tipoSubsistencia.value ? { codigo: this.detalleForm.controls.tipoSubsistencia.value.codigo } : null,
      subsistente: this.detalleForm.controls.subsistenteCobertura.value,
      estado: this.detalleForm.controls.vigenteDetalle.value,
      fechaInicio: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.detalleForm.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    }];

    const mimSubsistentePlanCobertura = {
      mimPlan: { codigo: this.subsistentePlanCobertura.mimPlan.codigo },
      mimCoberturaIndemnizada: { codigo: this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: this.subsistentePlanCobertura.estado,
      mimSubsistentePlanCoberturaDetalleList: detalle
    };

    this.backService.subsistentePlanCobertura.putSubsistentePlanCobertura(
      this.subsistentePlanCobertura.mimCoberturaIndemnizada.codigo,
      this.subsistentePlanCobertura.mimPlan.codigo,
      this.planCobertura.planCobertura.codigo,
      mimSubsistentePlanCobertura).subscribe((respuesta: any) => {
        this.subsistentePlanCobertura = respuesta;
        // Limpiamos el formulario.
        this.limpiarFormularioDetalle();

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



  private limpiarFormularioCabecera2(param?: any) {
    this.cabeceraForm.reset();
    this.initCabeceraForm(param);
  }

  private initCabeceraForm(param?: any) {
    this.isCabeceraForm = Promise.resolve(
      this.cabeceraForm = this.formBuilder.group({
        plan: new FormControl(param ? this.obtenerPlanSelected(param.mimPlan.codigo) : null, [Validators.required]),
        coberturaIndemnizada: new FormControl(param ? this.obtenerCoberturaIndemnizada(param.mimCoberturaIndemnizada.codigo) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
      })
    );

    this.estadoFecha = param && !param.estado || this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.cabeceraForm.disable();
    } else {
      if (!this._esCreacion) {
        this.cabeceraForm.controls.coberturaIndemnizada.disable();
        this.cabeceraForm.controls.plan.disable();
        if (param && !param.estado) {
          this.cabeceraForm.disable();
        }
        this.cabeceraForm.controls.vigente.enable();
      } else {
        this.cabeceraForm.controls.coberturaIndemnizada.disable();
        this.cabeceraForm.controls.vigente.setValue(true);
        this.cabeceraForm.controls.vigente.disable();
      }
    }
    this._onChangePlanes();
  }

  _onChangePlanes() {
    this.cabeceraForm.controls.plan.valueChanges.subscribe(async planIte => {
      this.coberturasIndemnizadas = [];
      await this.desplegarCoberturasSegunPlanSeleccionado(planIte.codigo);
      this.cabeceraForm.controls.coberturaIndemnizada.enable();
    });
  }

  async desplegarCoberturasSegunPlanSeleccionado(codigoPlan: any) {

    this.coberturasIndemnizadas = null;
    this.coberturasIndemnizadasProceso = [];
    this.coberturasIndemnizadasPlanCobertura = [];
    if (this.subsistentePlanCobertura) {
      const _condiciones = await this.backService.condicion.obtenerCondiciones({})
        .toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.condiciones = _condiciones.content;

      const _coberturasIndemnizadas = await this.backService.planCobertura.getPlanesCoberturas({
        'mimPlan.codigo': codigoPlan,
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.coberturasIndemnizadasProceso = _coberturasIndemnizadas.content;
    } else {
      const _condiciones = await this.backService.condicion.obtenerCondiciones({
        'aplicaSubsistencia': true,
        'estado': true
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.condiciones = _condiciones.content;

      const _coberturasIndemnizadas = await this.backService.planCobertura.getPlanesCoberturas({
        'mimPlan.codigo': codigoPlan,
        'mimEstadoPlanCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.ACTIVO
      }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.coberturasIndemnizadasProceso = _coberturasIndemnizadas.content;
    }
    this.coberturasIndemnizadas = this.coberturasIndemnizadasProceso.filter(item =>
      this.condiciones.find(condicion => condicion.mimPlanCobertura.codigo === item.codigo)
      && item.codigo !== this.planCobertura.planCobertura.codigo);
  }

}
