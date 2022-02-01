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
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimValorRescate, MimValorRescate } from '../../../model/mim-valor-rescate.model';
import { PostValorRescateAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { ValorRescateConfig } from './valor-rescate.config';

@Component({
  selector: 'app-valor-rescate',
  templateUrl: './valor-rescate.component.html',
  styles: [`.height_auto{height: auto;}`]
})
export class ValorRescateComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {
  // Id de la seccion
  id = 'valorRescate';
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  tipoRescates: any[];
  causas: any[];
  planCoberturas: any[] = [];
  _esCreacion: boolean;

  configuracion: ValorRescateConfig = new ValorRescateConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  valorRescate: any;
  estado = true;

  nombrePlan: any;
  nombreCobertura: any;

  listBeneficiariosPagoValor: any[];

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

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }
        this.planCobertura = ui;

        this._cargarDatosTabla(this.planCobertura.valorRescate);
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
        tipoRescate: new FormControl(param ? this.obtenertipoRescate(param.mimTipoRescateIndemnizacion.codigo) : null, [Validators.required]),
        causaRescate: new FormControl(param ? this.obtenerCausa(param.mimCausaIndemnizacion.codigo) : null, [Validators.required]),
        contribucionMinima: new FormControl(param ? param.contribucionesMinimas : null, [Validators.required, Validators.max(999)]),
        contribucionMaxima: new FormControl(param ? param.contribucionesMaximas : null, [Validators.required, Validators.max(999)]),
        valor: new FormControl(param ? param.valor : null, param && param.mimTipoRescateIndemnizacion.codigo === 2 ? [Validators.required] : null),
        rentabilidad: new FormControl(param ? param.rentabilidad : null),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
        beneficiarioPago : new FormControl(param ? this.obtenerBeneficiarioValor(param.mimBeneficiarioPagoValorRescate.codigo) : [Validators.required])
      }, { validators: [minMaxValidator('contribucionMinima', 'contribucionMaxima')] })
    );

    this._onChangeTipoRescate();

    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }

    if (!this._esCreacion) {
      this.form.controls.tipoRescate.disable();
      this.form.controls.causaRescate.disable();
    }

    if (param && !param.estado) {
      this.form.disable();
      this.form.controls.vigente.enable();
    }

  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  private obtenertipoRescate(codigo: any) {
    return this.tipoRescates ? this.tipoRescates.find(resp => resp.codigo === codigo) : null;
  }

  private obtenerCausa(codigo: any) {
    return this.causas ? this.causas.find(causa => causa.codigo === codigo) : null;
  }

  private obtenerBeneficiarioValor(codigo: any) {
    return this.listBeneficiariosPagoValor.find((item:any) => item.codigo === codigo);
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

  private _eliminar(codigoValorRescate: string) {
    this.backService.valorRescate.deleteValorRescate(codigoValorRescate).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });

      this._listar(this.planCobertura.planCobertura.codigo);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  async _toggleGuardar(toggle: boolean, valorRescate?: any) {

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
      await this._cargarDatosDesplegables(valorRescate);

      if (valorRescate) {
        this.valorRescate = JSON.parse(JSON.stringify(valorRescate));
        this._esCreacion = false;
        this.initForm(this.valorRescate);
      } else {
        this.valorRescate = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private async _cargarDatosDesplegables(valorRescate: any) {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    if (!this.tipoRescates || !this.causas || !this.planCoberturas) {
      const _tipoRescate = await this.backService.tipoRescateIndemnizacion.getTipoRescateIndemnizaciones({ estado: true, sort: 'nombre,asc' })
        .toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _causas = await this.backService.causaIndemnizacion.getCausasIndenizaciones({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _beneficiariosPagoValor = await this.backService.valorRescate.obtenerBeneficiariosPagoValor().toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.tipoRescates = _tipoRescate._embedded.mimTipoRescateIndemnizacion;
      this.causas = _causas._embedded.mimCausaIndemnizacion;
      this.listBeneficiariosPagoValor = _beneficiariosPagoValor._embedded.mimBeneficiarioPagoValorRescate;
    }
    if (valorRescate) {
      this._setRowInactivo(valorRescate);
    }
  }

  _setRowInactivo(dataRow: any) {
    if (!this._esCreacion && !this.obtenertipoRescate(dataRow.mimTipoRescateIndemnizacion.codigo)) {
      this.tipoRescates.push(dataRow.mimTipoRescateIndemnizacion);
    }
    if (!this._esCreacion && !this.obtenerCausa(dataRow.mimCausaIndemnizacion.codigo)) {
      this.causas.push(dataRow.mimCausaIndemnizacion);
    }

  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.valorRescate.getValoresRescate({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      'estado': estado,
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true
    }).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (estado === 'true') {
          this.store.dispatch(new PostValorRescateAction(page, this.id, Estado.Pendiente));
        }
        return;
      }

      // Informamos que ya hay valores de rescate al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostValorRescateAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private _cargarDatosTabla(page: Page<MimValorRescate>) {
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
    const valorRescate = {
      contribucionesMaximas: this.form.controls.contribucionMaxima.value,
      contribucionesMinimas: this.form.controls.contribucionMinima.value,
      rentabilidad: this.form.controls.rentabilidad.value,
      valor: this.form.controls.valor.value,

      mimCausaIndemnizacion: {
        codigo: this.form.controls.causaRescate.value.codigo
      },

      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      mimTipoRescateIndemnizacion: {
        codigo: this.form.controls.tipoRescate.value.codigo
      },
      mimBeneficiarioPagoValorRescate: {
        codigo: this.form.controls.beneficiarioPago.value.codigo
      },

      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: true
    } as IMimValorRescate;

    this.backService.valorRescate.postValorRescate(valorRescate).subscribe((respuesta: any) => {

      // Cerramos el modal.
      this.valorRescate = undefined;
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
    this.valorRescate.contribucionesMaximas = this.form.controls.contribucionMaxima.value;
    this.valorRescate.contribucionesMinimas = this.form.controls.contribucionMinima.value;
    this.valorRescate.rentabilidad = this.form.controls.rentabilidad.value;
    this.valorRescate.valor = this.form.controls.valor.value;
    this.valorRescate.mimValorRescatePlanCoberturaList = this.form.value.planCobertura;
    this.valorRescate.mimCausaIndemnizacion = this.form.controls.causaRescate.value;
    this.valorRescate.mimTipoRescateIndemnizacion = this.form.controls.tipoRescate.value;
    this.valorRescate.estado = this.form.controls.vigente.value;
    this.valorRescate.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.valorRescate.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    this.valorRescate.mimBeneficiarioPagoValorRescate = this.form.controls.beneficiarioPago.value;

    this.backService.valorRescate.putValorRescate(this.valorRescate.codigo, this.valorRescate).subscribe((respuesta: any) => {
      // Cerramos el modal.
      this.valorRescate = undefined;
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
    this.valorRescate = undefined;
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
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  _onToggleStatus($event) {
    this._obtenerDatosConEstados($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados($event, estado: boolean) {
    this.estado = estado;
    this._listar(this.planCobertura.planCobertura.codigo, $event.pagina, $event.tamano, $event.sort, this.estado ? 'true' : '');
  }

  _onChangeTipoRescate() {
    this.form.controls.tipoRescate.valueChanges.subscribe(tipoRescate => {
      // Si el tipo de rescate es 2 = % Valor aportado
      if (tipoRescate && tipoRescate.codigo === 2) {
        // Se vuelven los campos requeridos
        this.form.controls.valor.setErrors({ 'required': true });
      } else {
        // Se vuelve los campos opcionales
        this.form.controls.valor.setErrors(null);
      }
    });
  }

}
