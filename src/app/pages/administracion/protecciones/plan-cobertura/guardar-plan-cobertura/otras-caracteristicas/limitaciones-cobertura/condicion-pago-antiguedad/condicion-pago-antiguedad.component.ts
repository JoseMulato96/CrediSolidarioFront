import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { Page } from '@shared/interfaces/page.interface';
import { numberMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { IMimCondicionPagoAntiguedad, MimCondicionPagoAntiguedad } from '../../../../model/mim-condicion-pago-antiguedad';
import { PostLimitacionCoberturaAction } from '../../../../plan-cobertura.actions';
import { CondicionPagoAntiguedadConfig } from './condicion-pago-antiguedad.config';

@Component({
  selector: 'app-condicion-pago-antiguedad',
  templateUrl: './condicion-pago-antiguedad.component.html',
  styleUrls: ['./condicion-pago-antiguedad.component.css']
})
export class CondicionPagoAntiguedadComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  tiposLimitaciones: any[];
  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: CondicionPagoAntiguedadConfig = new CondicionPagoAntiguedadConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  condicionPagoAntiguedad: any;
  estado = true;
  estadoFecha: boolean;

  valorMaximoLimitacion = null;
  optionsMask;

  nombrePlan: any;
  nombreCobertura: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }

        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.condicionPagoAntiguedad);
      }));
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
        antiguedadMinima: new FormControl(param ? param.antiguedadMinima : null, [Validators.required, Validators.min(0), Validators.max(99)]),
        antiguedadMaxima: new FormControl(param ? param.antiguedadMaxima : null, [Validators.required, Validators.min(1), Validators.max(99)]),
        tipoLimitacion: new FormControl(param ? this.obtenerTipoLimitacion(param.mimTipoLimitacion.codigo) : null, [Validators.required]),
        valor: new FormControl(param ? param.valor : null, [Validators.required, Validators.max(999)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }, { validators: [minMaxValidator('antiguedadMinima', 'antiguedadMaxima')] })
    );

    this.estadoFecha = this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.form.controls.antiguedadMinima.disable();
      this.form.controls.antiguedadMaxima.disable();
      this.form.controls.tipoLimitacion.disable();

      this.estadoFecha = param && !param.estado;
      if (this.estadoFecha) {
        this.form.disable();
        this.form.controls.vigente.enable();
      }
    }

    this._onChangeTipoLimitacion();
  }

  private obtenerTipoLimitacion(codigo: any) {
    return this.tiposLimitaciones ? this.tiposLimitaciones.find(resp => resp.codigo === codigo) : null;
  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
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

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  private _alEliminar($event: any) {

    this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.deseaEliminarRow')
      .subscribe((mensaje: string) => {
        const modalPromise = this.frontService.alert.confirm(mensaje, 'danger');
        const newObservable = from(modalPromise);

        newObservable.subscribe(
          (desition: any) => {
            if (desition === true) {
              this._eliminar($event.codigo);
            }
          });
      });
  }

  private _eliminar(codigoCondicionPagoAntiguedad: string) {
    this.backService.condicionPagoAntiguedad.deleteCondicionPagoAntiguedad(codigoCondicionPagoAntiguedad)
      .subscribe(resp => {
        this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
          this.frontService.alert.success(msn);
        });

        this._listar(this.planCobertura.planCobertura.codigo);
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  async _toggleGuardar(toggle: boolean, condicionPagoAntiguedad?: any) {

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
      await this._cargarDatosDesplegables(condicionPagoAntiguedad);

      if (condicionPagoAntiguedad) {
        this.condicionPagoAntiguedad = JSON.parse(JSON.stringify(condicionPagoAntiguedad));
        this._esCreacion = false;
        this.initForm(this.condicionPagoAntiguedad);
      } else {
        this.condicionPagoAntiguedad = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private async _cargarDatosDesplegables(condicionPagoAntiguedad: any) {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    if (!this.tiposLimitaciones) {
      const _tiposLimitaciones = await this.backService.tipoLimitacion.getTiposLimitaciones({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.tiposLimitaciones = _tiposLimitaciones._embedded.mimTipoLimitacion;
    }
    if (condicionPagoAntiguedad) {
      this._setRowInactivo(condicionPagoAntiguedad);
    }
  }

  _setRowInactivo(dataRow: any) {
    if (!this._esCreacion && !this.obtenerTipoLimitacion(dataRow.mimTipoLimitacion.codigo)) {
      this.tiposLimitaciones.push(dataRow.mimTipoLimitacion);
    }
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {

    const param: any = { 'mimPlanCobertura.codigo': codigoPlanCobertura, estado: estado, page: pagina, size: tamanio, isPaged: true, sort: sort };

    this.backService.condicionPagoAntiguedad.getCondicionesPagoAntiguedad(param).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.planCobertura.planCobertura.diasMaximoEvento,
          this.planCobertura.excepcionDiagnostico,
          page,
          this.planCobertura.sublimiteCobertura,
          this.planCobertura.condicionesPagarEvento,
          'limitacionCobertura',
          Estado.Pendiente
        ));
        return;
      }

      // Informamos que ya hay valores de rescate al Redux para controlar el estado del componente.
      this.store.dispatch(new PostLimitacionCoberturaAction(
        this.planCobertura.planCobertura.diasMaximoEvento,
        this.planCobertura.excepcionDiagnostico,
        page,
        this.planCobertura.sublimiteCobertura,
        this.planCobertura.condicionesPagarEvento,
        'limitacionCobertura',
        Estado.Guardado
      ));

      this.planCobertura.condicionPagoAntiguedad = page;
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private _cargarDatosTabla(page: Page<MimCondicionPagoAntiguedad>) {
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

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
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
    const condicionPagoAntiguedad = {
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      antiguedadMinima: this.form.controls.antiguedadMinima.value,
      antiguedadMaxima: this.form.controls.antiguedadMaxima.value,
      mimTipoLimitacion: {
        codigo: this.form.controls.tipoLimitacion.value.codigo
      },
      valor: this.form.controls.valor.value,
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      estado: true
    } as IMimCondicionPagoAntiguedad;

    this.backService.condicionPagoAntiguedad.postCondicionPagoAntiguedad(condicionPagoAntiguedad).subscribe((respuesta: any) => {

      // Cerramos el modal.
      this.condicionPagoAntiguedad = undefined;
      this.mostrarGuardar = false;
      // Limpiamos el formulario.
      this.limpiarFormulario();

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

    this.condicionPagoAntiguedad.antiguedadMinima = this.form.controls.antiguedadMinima.value;
    this.condicionPagoAntiguedad.antiguedadMaxima = this.form.controls.antiguedadMaxima.value;
    this.condicionPagoAntiguedad.mimTipoLimitacion = this.form.controls.tipoLimitacion.value;
    this.condicionPagoAntiguedad.valor = this.form.controls.valor.value;
    this.condicionPagoAntiguedad.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    this.condicionPagoAntiguedad.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.condicionPagoAntiguedad.estado = this.form.controls.vigente.value;

    this.backService.condicionPagoAntiguedad.putCondicionPagoAntiguedad(this.condicionPagoAntiguedad.codigo, this.condicionPagoAntiguedad).subscribe((respuesta: any) => {
      // Cerramos el modal.
      this.condicionPagoAntiguedad = undefined;
      this.mostrarGuardar = false;
      // Limpiamos el formulario.
      this.limpiarFormulario();

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
    this.condicionPagoAntiguedad = undefined;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  _onChangeTipoLimitacion() {
    this.form.controls.tipoLimitacion.valueChanges.subscribe(tipoLimitacion => {
      // Si el tipo de limitación es 1 = Porcentaje valor de protección por preexistencia
      if (tipoLimitacion && tipoLimitacion.codigo === 1) {
        this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
        this.valorMaximoLimitacion = '100';
        this.optionsMask = percentMaskConfig;
        this.form.controls.valor.updateValueAndValidity();
        this.form.controls.valor.markAsTouched();
      } else {
        this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(999.99)]);
        this.valorMaximoLimitacion = '999';
        this.optionsMask = numberMaskConfig;
        this.form.controls.valor.updateValueAndValidity();
        this.form.controls.valor.markAsTouched();
      }
      this.form.controls.valor.setValue(null);
    });
  }

}
