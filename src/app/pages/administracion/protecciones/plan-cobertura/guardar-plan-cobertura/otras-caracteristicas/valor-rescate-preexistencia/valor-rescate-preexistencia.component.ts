import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { Page } from '@shared/interfaces/page.interface';
import { currencyMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostBeneficioPreexistenciaAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';

import { ValorRescatePreexistenciaConfig } from './valor-rescate-preexistencia.config';

@Component({
  selector: 'app-valor-rescate-preexistencia',
  templateUrl: './valor-rescate-preexistencia.component.html',
})
export class ValorRescatePreexistenciaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  /** Id de la seccion */
  id = 'beneficiosPreexistencia';
  configuracion: ValorRescatePreexistenciaConfig = new ValorRescatePreexistenciaConfig();
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;

  dropdown: boolean;
  mostrarGuardar: boolean;
  estado = true;
  beneficiosPreexistencia: any;
  tipoValorVolver: any[];

  estadoCrear = true;
  estadoFecha: boolean;
  selection = false;
  tipo: boolean;
  valorMaximoDevolver;
  optionsMask;

  nombrePlan: any;
  nombreCobertura: any;


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

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {

    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        antiguedadMinima: new FormControl(param ? param.dato.antiguedadMinima : null, [Validators.required, Validators.max(999), Validators.min(1)]),
        antiguedadMaxima: new FormControl(param ? param.dato.antiguedadMaxima : null, [Validators.required, Validators.max(999), Validators.min(1)]),
        tipoValorDevolver: new FormControl(param ? this.obtenertipoValorDevolver(param.dato.mimTipoValorDevolver.codigo) : null, [Validators.required]),
        valor: new FormControl(param ? param.dato.valor : null, [Validators.required]),
        vigente: new FormControl(param ? param.dato.estado : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.dato.fechaInicio, param.dato.fechaFin) : null, [Validators.required]),
        aplicaAsegurado: new FormControl(param ? param.dato.aplicaAsegurado : false),
        aplicaResponsable: new FormControl(param ? param.dato.aplicaResponsable : false),

      }, { validators: [minMaxValidator('antiguedadMinima', 'antiguedadMaxima')] })
    );

    this._selecionTipoSublimite();

    this.activarValorDevolver(param ? param.dato.mimTipoValorDevolver.codigo : null);

    if (this._esCreacion) {
      this.form.controls.vigente.setValue(true);
      this.form.controls.vigente.disable();
      this.form.controls.aplicaAsegurado.setValue(false);
      this.form.controls.aplicaResponsable.setValue(false);
    }
  }

  private obtenertipoValorDevolver(codigo: any) {
    return this.tipoValorVolver.find(res => res.codigo === codigo);
  }

  private activarValorDevolver(codigo) {
    this.selection = true;
    if (codigo === MIM_PARAMETROS.MIM_TIPO_VALOR_DEVOLVER.PORCENTAJE_COBERTURA) {
      this.tipo = true;
      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.valorMaximoDevolver = '100';
      this.optionsMask = percentMaskConfig;
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
    } else if (codigo === MIM_PARAMETROS.MIM_TIPO_VALOR_DEVOLVER.DEFINIDO) {
      this.tipo = false;
      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(9999999999999.99)]);
      this.valorMaximoDevolver = '9.999.999.999.999,99';
      this.optionsMask = currencyMaskConfig;
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
    }
  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  _selecionTipoSublimite() {
    this.form.controls.tipoValorDevolver.valueChanges.subscribe((seleccion) => {
      this.selection = true;
      this.form.controls.valor.setValue(null);
      this.activarValorDevolver(seleccion ? seleccion.codigo : null);

    });
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this._listar(codigoPlanCobertura);
      }
    }));

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {

          return;
        }

        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.beneficioPreexistencia);
      }));
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

  private _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.beneficiosPreexistencia = undefined;
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

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

  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.beneficioPreexistencia.getBeneficiosPreexistencia({
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
          this.store.dispatch(new PostBeneficioPreexistenciaAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay beneficionpreexistentes al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostBeneficioPreexistenciaAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  async _toggleGuardar(toggle: boolean, beneficiosPreexistencia?: any) {
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
      await this._cargarDatosDesplegables();

      if (beneficiosPreexistencia) {
        this.beneficiosPreexistencia = JSON.parse(JSON.stringify(beneficiosPreexistencia));
        this._esCreacion = false;
        this.initForm(this.beneficiosPreexistencia);
      } else {
        this.beneficiosPreexistencia = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
    this.selection = false;
  }

  private async _cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    const _tipoValorDevlver = await this.backService.tipoValorDevolver.obtenerTiposValorDevolver({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.tipoValorVolver = _tipoValorDevlver._embedded.mimTipoValorDevolver;
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

  limpiarFormularioDetalle() {
    this.beneficiosPreexistencia = undefined;
    this.form.reset();
    this.initForm();
    this.selection = false;
  }

  private _alEliminar($event: any) {
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.beneficioPreexistencia.deleteBeneficioPreexistencia($event.codigo).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                this.frontService.alert.success(texto).then(() => {
                  // Recargamos la informacion de la tabla.
                  this._listar(this.planCobertura.planCobertura.codigo);
                });
              });
            });
          }
        });
    });
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
    const form: any = this.form.value;
    const mimBeneficioPreexistente = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      antiguedadMaxima: this.form.controls.antiguedadMaxima.value,
      antiguedadMinima: this.form.controls.antiguedadMinima.value,
      mimTipoValorDevolver: { codigo: form.tipoValorDevolver.codigo },
      valor: this.form.controls.valor.value,
      estado: this.form.controls.vigente.value,
      aplicaAsegurado: this.form.controls.aplicaAsegurado.value,
      aplicaResponsable: this.form.controls.aplicaResponsable.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.beneficioPreexistencia.postBeneficioPreexistencia(mimBeneficioPreexistente).subscribe((respuesta: any) => {
      // cerramos modal
      this.beneficiosPreexistencia = undefined;
      this.mostrarGuardar = false;
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
    const beneficiosPreexistencia = {
      codigo: this.beneficiosPreexistencia.dato.codigo,
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      antiguedadMaxima: this.form.controls.antiguedadMaxima.value,
      antiguedadMinima: this.form.controls.antiguedadMinima.value,
      mimTipoValorDevolver: { codigo: this.form.controls.tipoValorDevolver.value.codigo },
      valor: this.form.controls.valor.value,
      estado: this.form.controls.vigente.value,
      aplicaAsegurado: this.form.controls.aplicaAsegurado.value,
      aplicaResponsable: this.form.controls.aplicaResponsable.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.beneficioPreexistencia.putBeneficioPreexistencia(this.beneficiosPreexistencia.dato.codigo, beneficiosPreexistencia).subscribe((respuesta: any) => {

      // Cerramos el modal.
      this.beneficiosPreexistencia = undefined;
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
}
