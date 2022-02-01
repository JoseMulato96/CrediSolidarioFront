import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimDeducible, MimDeducible } from '../../../model/mim-deducible.model';
import { PostDeduciblesAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { DeduciblesConfig } from './deducibles.config';

@Component({
  selector: 'app-deducibles',
  templateUrl: './deducibles.component.html',
})
export class DeduciblesComponent extends FormValidate implements OnInit, OnDestroy, AfterViewInit, FormComponent {
  // Id de la seccion
  id = 'deducibles';
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  tiposDeducibles: any[];
  tiposPago: any[];
  tiposRestitucionDeducible: any[];

  configuracion: DeduciblesConfig = new DeduciblesConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  deducible: any;

  noAplica: any = { codigo: null, nombre: this.translate.instant('global.na') };

  estado = true;
  estadoFecha: boolean;

  nombrePlan: any;
  nombreCobertura: any;

  valorMaximoDeducible: any;

  customCurrencyMaskConfig = {
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

  ngOnInit() {
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
        this._cargarDatosTabla(this.planCobertura.deducibles);
      }));
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit() {
    // do nothing
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoDeducible: new FormControl(param ? param.mimTipoDeducible ? this.obtenerTipoDeducible(param.mimTipoDeducible.codigo) : this.noAplica : null, [Validators.required]),
        tipoPago: new FormControl(param ? this.obtenerTipoPago(param.mimTipoPago.codigo) : null, [Validators.required, Validators.maxLength(3)]),
        cantidad: new FormControl(param ? param.cantidad : null, [Validators.required]),
        tipoRestitucionDeducible: new FormControl(param ? this.obtenerTipoRestitucionDeducible(param.mimTipoRestitucionDeducible.codigo) : null, [Validators.required]),
        aplicaProrroga: new FormControl(param ? param.aplicaProrroga : false),
        discontinuidadDiasCalendario: new FormControl(param ? param.discontinuidadCalendario : null, [Validators.required, Validators.max(999)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null,
          [Validators.required])
      })
    );

    this.changeProrroga();
    this.changeTipoDeducible();
    this.estadoFecha = this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }

    if (param && !param.estado && !this.estadoFecha) {
      this.form.disable();
      this.estadoFecha = param !== null && param !== undefined && !param.estado;
    }

    if (param && param.mimTipoDeducible.codigo) {
      this.validatorsCantidad(param.mimTipoDeducible.codigo);
    }

  }

  private obtenerTipoDeducible(codigo: any) {
    return this.tiposDeducibles ? this.tiposDeducibles.find(tipoDeducible => tipoDeducible.codigo === codigo) : null;
  }

  private obtenerTipoPago(codigo: any) {
    return this.tiposPago ? this.tiposPago.find(tipoPago => tipoPago.codigo === codigo) : null;
  }

  private obtenerTipoRestitucionDeducible(codigo: any) {
    return this.tiposRestitucionDeducible ? this.tiposRestitucionDeducible.find(tipoRestitucionDeducible => tipoRestitucionDeducible.codigo === codigo) : null;
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
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

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onClickCelda($event) {
    this._toggleGuardar(true, $event);
  }

  async _toggleGuardar(toggle: boolean, deducible?: any) {
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
      await this._cargarDatosDesplegables(deducible);

      if (deducible) {
        this.deducible = JSON.parse(JSON.stringify(deducible));
        this._esCreacion = false;
        this.initForm(this.deducible);
      } else {
        this.deducible = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private async _cargarDatosDesplegables(deducible: any) {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    if (!this.tiposDeducibles) {
      const _tiposDeducibles = await this.backService.tipoDeducible.obtenerTiposDeducibles({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _tiposPago = await this.backService.tipoPago.obtenerTiposPago({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _tiposRestitucionDeducible = await this.backService.tipoRestitucionDeducible.obtenerTiposRestitucionDeducible({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

      this.tiposDeducibles = _tiposDeducibles._embedded.mimTipoDeducible;
      this.tiposPago = _tiposPago._embedded.mimTipoPago;
      this.tiposRestitucionDeducible = _tiposRestitucionDeducible._embedded.mimTipoRestitucionDeducible;

      // Agregamos los items de N/A.
      this.tiposDeducibles.push({ codigo: null, nombre: this.translate.instant('global.na') });
    }
    if (deducible) {
      this._setRowInactivo(deducible);
    }
  }

  _setRowInactivo(dataRow: any) {
    if (!this._esCreacion && dataRow.mimTipoDeducible && !this.obtenerTipoDeducible(dataRow.mimTipoDeducible.codigo)) {
      this.tiposDeducibles.push(dataRow.mimTipoDeducible);
    }
    if (!this._esCreacion && !this.obtenerTipoPago(dataRow.mimTipoPago.codigo)) {
      this.tiposPago.push(dataRow.mimTipoPago);
    }
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.deducible.obtenerDeducibles({
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
          this.store.dispatch(new PostDeduciblesAction(page, this.id, Estado.Pendiente));
        }
        return;
      }

      // Informamos que ya hay exclusiones plan cobertura al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostDeduciblesAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private _cargarDatosTabla(page: Page<MimDeducible>) {
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
    const deducible = {
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      mimTipoPago: {
        codigo: this.form.controls.tipoPago.value.codigo
      },
      mimTipoRestitucionDeducible: {
        codigo: this.form.controls.tipoRestitucionDeducible.value.codigo
      },
      cantidad: this.form.controls.cantidad.value,
      aplicaProrroga: this.form.controls.aplicaProrroga.value,
      discontinuidadCalendario: this.form.controls.discontinuidadDiasCalendario.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: true
    } as IMimDeducible;

    if (this.form.controls.tipoDeducible.value && this.form.controls.tipoDeducible.value.codigo) {
      deducible.mimTipoDeducible = {
        codigo: this.form.controls.tipoDeducible.value.codigo
      };
    }

    this.backService.deducible.crearDeducible(deducible).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.deducible = undefined;
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

  _actualizar() {
    this.deducible.mimTipoPago.codigo = this.form.controls.tipoPago.value.codigo;
    this.deducible.mimTipoRestitucionDeducible.codigo = this.form.controls.tipoRestitucionDeducible.value.codigo;
    this.deducible.cantidad = this.form.controls.cantidad.value;
    this.deducible.aplicaProrroga = this.form.controls.aplicaProrroga.value;
    this.deducible.discontinuidadCalendario = this.form.controls.discontinuidadDiasCalendario.value;
    this.deducible.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.deducible.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');

    if (this.form.controls.tipoDeducible.value && this.form.controls.tipoDeducible.value.codigo) {
      this.deducible.mimTipoDeducible = {
        codigo: this.form.controls.tipoDeducible.value.codigo
      };
    } else {
      this.deducible.mimTipoDeducible = null;
    }

    this.backService.deducible.actualizarDeducible(this.deducible.codigo, this.deducible).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.deducible = undefined;
      this.mostrarGuardar = false;

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.planCobertura.planCobertura.codigo, 0, 10, 'fechaCreacion,desc', this.estado ? 'true' : '');
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.deducible = undefined;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
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

  changeProrroga() {
    if (this.form && this.form.controls) {
      if (!this.form.controls.aplicaProrroga.value) {
        this.form.controls.discontinuidadDiasCalendario.disable();
      }
    }
    this.form.controls.aplicaProrroga.valueChanges.subscribe((value: any) => {

      if (value) {
        this.form.controls.discontinuidadDiasCalendario.enable();
      } else {
        this.form.controls.discontinuidadDiasCalendario.disable();
        this.form.controls.discontinuidadDiasCalendario.setValue('');
      }
    });
  }

  changeTipoDeducible() {
    this.form.controls.tipoDeducible.valueChanges.subscribe((value: any) => {
      this.validatorsCantidad(value.codigo);
    });
  }

  validatorsCantidad(codigoTipoDeducible) {
    if (codigoTipoDeducible === MIM_PARAMETROS.MIM_TIPO_DEDUCIBLE.DINERO) {
      this.form.controls.cantidad.setValidators([Validators.required, Validators.min(0), Validators.max(999999999)]);
      this.valorMaximoDeducible = '999.999.999';
      this.form.controls.cantidad.updateValueAndValidity();
      this.form.controls.cantidad.markAsTouched();
    } else {
      this.form.controls.cantidad.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.valorMaximoDeducible = '100';
      this.form.controls.cantidad.updateValueAndValidity();
      this.form.controls.cantidad.markAsTouched();
    }
  }

}
