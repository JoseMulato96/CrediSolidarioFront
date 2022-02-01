import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { MimReglasExcepciones } from '../../../model/MimReglasExcepciones.model';
import { PostReglasExcepcionesAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ReglasExcepcionesConfig } from './reglas-excepciones.config';
import { masksPatterns } from '@shared/util/masks.util';
import { DateUtil } from '@shared/util/date.util';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { GENERALES } from '@shared/static/constantes/constantes';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-reglas-excepciones',
  templateUrl: './reglas-excepciones.component.html'
})
export class ReglasExcepcionesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  id = 'reglasExcepciones';

  configuracion: ReglasExcepcionesConfig = new ReglasExcepcionesConfig();
  patterns = masksPatterns;

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  dropdown: boolean;
  mostrarGuardar: boolean;
  periodoCarencia: any;
  estado = 'true';
  dataFiltros: any;
  private codigoPlanCobertura: any;
  private codigoTipoMovimiento: any = null;
  form: FormGroup;
  isForm: Promise<any>;

  validSend = false;
  tipoMovimientos: any = [];

  nombrePlan: any;
  nombreCobertura: any;

  formReglas: FormGroup;
  isFormReglas: Promise<any>;
  rolesAprobador: any = [];
  condiciones: any = [];
  reglaExcepcion: any;
  _esCreacion: boolean;

  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this.codigoPlanCobertura = codigoPlanCobertura;
        this.codigoTipoMovimiento = GENERALES.TIPO_MOVIMIENTO.INCREMENTAR;
        this._listar(this.codigoTipoMovimiento, codigoPlanCobertura);
      }
    }));

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }

        this.planCobertura = ui;
        this._initForm(this.planCobertura);
        this._cargarDatosTabla(this.planCobertura.reglasExcepciones);
      }));

      this.backService.tiposMovimientos.getTiposMovimientos({}).subscribe(response => {
        this.tipoMovimientos = response._embedded.mimTipoMovimiento;
        const _tipoMovimientos = [{codigo: 0, nombre: 'Seleccionar' }, ...this.tipoMovimientos]
        this.configuracion.gridConfig.component.cargarDatosDropdown([
          { code: 'tipoSolicitud', datos: this.formatDropdown(_tipoMovimientos) }
        ]);
        this.configuracion.gridConfig.component.selecrtedDropdown([
          { code: 'tipoSolicitud', dato: GENERALES.TIPO_MOVIMIENTO.INCREMENTAR }
        ]);
      });
  }

  _initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tiempoAprobacion: new FormControl(params && params.planCobertura.tiempoAprobacionExcepciones ? String(params.planCobertura.tiempoAprobacionExcepciones) : '1', [Validators.required]),
      }));

    this.form.controls.tiempoAprobacion.valueChanges.subscribe(r => {
      if (r && r !== null) {
        this.validSend = false;
      } else {
        this.validSend = true;
      }
    });
  }

  _selectDropdown(event: any) {
    this.dataFiltros = event;
    this.dataFiltros.forEach(element => {
      this.codigoTipoMovimiento = element.codigoDropdown.value;
      this._listar(this.codigoTipoMovimiento, this.codigoPlanCobertura, this.estado);
    });
  }

  formatDropdown(datos: any[]) {
    const item: any[] = [];
    datos.forEach(x => {
      item.push({ label: x.nombre, value: x.codigo });
    });
    return item;
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  private _listar(codigoTipoMovimiento: any, codigoPlanCobertura: any, status = 'true', pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    let object: any = {
      'codigoPlanCobertura.codigo': codigoPlanCobertura,
      estado: status ? status: '',
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    };
    if (codigoTipoMovimiento !== null && codigoTipoMovimiento !== 0) {
      object['codigoTipoMovimiento.codigo'] = codigoTipoMovimiento
    }
    this.backService.reglaExcepcion.obtenerReglasExcepciones(object).subscribe((page: any) => {
      this.configuracion.gridConfig.component.limpiar();
      if (!page || !page.content || page.content.length === 0) {
        if (status === 'true') {
          this.store.dispatch(new PostReglasExcepcionesAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      let estadoModulo = this.validarEstado(page.content) === undefined && (status === 'false' || status === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostReglasExcepcionesAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.periodoCarencia = undefined;
  }

  async _toggle() {
    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });
      this._cerrarSeccion();
    }
  }

  async _toggleGuardar(toggle: boolean, reglasExcepciones?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      // Intentamos cargar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      if (toggle) {
        await this._cargarDatosDesplegables();
      }
      if (reglasExcepciones) {
        this.reglaExcepcion = JSON.parse(JSON.stringify(reglasExcepciones));
        this._esCreacion = false;
        this.initForm(this.reglaExcepcion);
      } else {
        this.reglaExcepcion = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  limpiarFormulario() {
    this.formReglas.reset();
    this.initForm();
  }

  private async _cargarDatosDesplegables() {
    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    // Lista para el select de roles aprobadores
    const _RolesAprobador = await this.backService.rolAprobador.getRolAprobadores({
      estado: true,
      isPaged: true,
      sort: 'nombre,asc',
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.rolesAprobador = _RolesAprobador._embedded.mimRolAprobador;
  }

  public _toggleGuardarTiempoProbacion() {
    if (this.form.invalid) {
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    let objectPlanCobertura: any = this.planCobertura.planCobertura;
    objectPlanCobertura.tiempoAprobacionExcepciones = this.form.controls.tiempoAprobacion.value;
    this.backService.planCobertura.putPlanCobertura(objectPlanCobertura.codigo, objectPlanCobertura)
      .subscribe(response => {
        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.form.controls.tiempoAprobacion.setValue(response.tiempoAprobacionExcepciones);
          });
        });
      });
  }

  _onSiguiente($event) {
    this._listar(this.codigoTipoMovimiento, this.codigoPlanCobertura, this.estado, $event);
  }

  _onAtras($event) {
    this._listar(this.codigoTipoMovimiento, this.codigoPlanCobertura, this.estado, $event);
  }

  _onClickCelda($event) {
    this._toggleGuardar(true, $event);
  }


  _onToggleStatus($event) {
    this._listar(this.codigoTipoMovimiento, this.codigoPlanCobertura, $event.currentTarget.checked, $event);
  }

  private _cargarDatosTabla(page: Page<MimReglasExcepciones>) {
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
        _permitirExcepcion: item.permitirExcepcion ? 'Si' : 'No'
      });
    }
    return listObj;
  }

  hasChanges() {
    return this.formReglas && this.formReglas.dirty;
  }

  private initForm(param?: any) {
    this.isFormReglas = Promise.resolve(
      this.formReglas = this.formBuilder.group({
        tipoSolicitud: new FormControl(param && param.codigoTipoMovimiento ? this.obtenerTipoMovimiento(param.codigoTipoMovimiento.codigo) : null, [Validators.required]),
        condicion: new FormControl(param && param.codigoCondicion ? param.codigoCondicion.nombre : null, [Validators.required]),
        permitirExcepcion: new FormControl(param ? param.permitirExcepcion : false),
        rolAprobador: new FormControl(param && param.codigoRolAprobador ? this.obtenerRolAprobado(param.codigoRolAprobador.codigo) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : true, [Validators.required]),
        fechaVigencia: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      })
    );

    this.formReglas.controls.rolAprobador.disable();

    if(!this._esCreacion){
      this.formReglas.controls.tipoSolicitud.disable();
      this.formReglas.controls.condicion.disable();
      if(param && param.permitirExcepcion){
        this.formReglas.controls.rolAprobador.enable();
        this.formReglas.controls.rolAprobador.setValidators([Validators.required]);
        this.formReglas.controls.rolAprobador.updateValueAndValidity();
      }
    }

    this.changeValueControls();
  }

  private changeValueControls(){
    this.formReglas.controls.permitirExcepcion.valueChanges.subscribe((value) => {
      if(!value){
        this.formReglas.controls.rolAprobador.reset();
        this.formReglas.controls.rolAprobador.disable();
        this.formReglas.controls.rolAprobador.setValidators([]);
        this.formReglas.controls.rolAprobador.updateValueAndValidity();
        return;
      }
      this.formReglas.controls.rolAprobador.enable();
      this.formReglas.controls.rolAprobador.setValidators([Validators.required]);
      this.formReglas.controls.rolAprobador.updateValueAndValidity();
    });
  }

  private obtenerTipoMovimiento (codigo: any){
    return this.tipoMovimientos.find(x => x.codigo ===codigo);
  }
  private obtenerCondicion (codigo: any){
    return this.condiciones.find(x => x.codigo ===codigo);
  }
  private obtenerRolAprobado (codigo: any){
    return this.rolesAprobador.find(x => x.codigo ===codigo);
  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  _guardar() {
    if (this.formReglas.invalid) {
      this.validateForm(this.formReglas);
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
    const form: any = this.formReglas.value;
    const param = {
      codigoTipoMovimiento: { codigo: form.tipoSolicitud.codigo },
      codigoCondicion: { codigo: form.condicion.codigo },
      codigoRolAprobador: form.permitirExcepcion ? {codigo: form.rolAprobador.codigo } : null,
      codigoPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: true,
      permitirExcepcion: form.permitirExcepcion,
      fechaInicio: DateUtil.dateToString(form.fechaVigencia[0], 'dd-MM-yyyy'),
      fechaFin: form.fechaVigencia.length > 1 ? DateUtil.dateToString(form.fechaVigencia[1], 'dd-MM-yyyy') : null,
    };

    this.backService.reglaExcepcion.postReglaExcepcion(param).subscribe((respuesta: any) => {
      // cerramos modal
      this.reglaExcepcion = undefined;
      this.mostrarGuardar = false;
      this.limpiarFormulario();

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.codigoTipoMovimiento, this.planCobertura.planCobertura.codigo);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    const _form: any = this.formReglas.getRawValue();

    const param = {
      codigo: this.reglaExcepcion.codigo,
      codigoTipoMovimiento: { codigo: this.reglaExcepcion.codigoTipoMovimiento.codigo },
      codigoCondicion: { codigo: this.reglaExcepcion.codigoCondicion.codigo },
      codigoRolAprobador: _form.permitirExcepcion ? {codigo: _form.rolAprobador.codigo } : null,
      codigoPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      permitirExcepcion: _form.permitirExcepcion,
      estado: _form.vigente,
      fechaInicio: DateUtil.dateToString(_form.fechaVigencia[0], 'dd-MM-yyyy'),
      fechaFin: _form.fechaVigencia.length > 1 ? DateUtil.dateToString(_form.fechaVigencia[1], 'dd-MM-yyyy') : null,
    };

    this.backService.reglaExcepcion.putReglaExcepcion(this.reglaExcepcion.codigo, param).subscribe(() => {

        // Cerramos el modal.
        this.reglaExcepcion = undefined;
        this.mostrarGuardar = false;
        // Limpiamos el formulario.
        this.limpiarFormulario();

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this._listar(this.codigoTipoMovimiento, this.planCobertura.planCobertura.codigo);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  getCondiciones(event: any) {
    this.backService.condicionRegla.getCondicionesReglasAutocompletar(event.query).subscribe((response: any) => {
      this.condiciones = response;
    });
  }

}
