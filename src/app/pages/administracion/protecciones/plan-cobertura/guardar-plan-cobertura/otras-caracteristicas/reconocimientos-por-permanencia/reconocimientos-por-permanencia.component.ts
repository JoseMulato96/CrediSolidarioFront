import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { PostReconocimientosPorPermanenciaAction } from '../../../plan-cobertura.actions';
import { Page } from '@shared/interfaces/page.interface';
import { DateUtil } from '@shared/util/date.util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ReconocimientosPorPermanenciaConfig } from './reconocimientos-por-permanencia.config';
import { GENERALES } from '@shared/static/constantes/constantes';
import { numberMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-reconocimientos-por-permanencia',
  templateUrl: './reconocimientos-por-permanencia.component.html'
})
export class ReconocimientoPorPermanenciaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  /** Id de la seccion */
  id = 'reconocimientoPermanencia';
  configuracion: ReconocimientosPorPermanenciaConfig = new ReconocimientosPorPermanenciaConfig();
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;

  dropdown: boolean;
  mostrarGuardar: boolean;
  estado = true;

  reconocimientoPorPermanencia: any;
  reconocimientosPorPermanencia: any[];
  unidades: any[];
  nombresComercialesPlanCobertura: any[];
  // optionsMask;
  nombrePlan: any;
  nombreCobertura: any;

  showNombreComercialPlanCobertura: boolean;
  rangoReconocimiento: string;

  valorMaximoProteccion;
  optionsMask;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.showNombreComercialPlanCobertura = false;
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        valorReconocimiento: new FormControl(param ? param.valorReconocimiento : null, [Validators.required]),
        unidad: new FormControl(param && param.mimTipoReconocido ? this.obtenerUnidad(param.mimTipoReconocido.codigo) : null, [Validators.required]),
        nombreComercialPlanCobertura: new FormControl(param && param.mimPlanCoberturaHijo ? this.planCoberturaHijo(param.mimPlanCoberturaHijo.codigo) : null),
        edadIngreso: new FormControl(param ? param.edadIngreso : null, [Validators.min(0), Validators.max(200)]),
        vigente: new FormControl(param ? param.estado : true, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      })
    );

    this.changeUnidad();

    this.activarValorReconocimiento(param?.mimTipoReconocido.codigo);

    if (this._esCreacion) {
      this.form.controls.valorReconocimiento.disable();
    }
  }

  private changeUnidad() {
    this.form.controls.unidad.valueChanges.subscribe(item => {
      if (!item) { return; }
      this.form.controls.valorReconocimiento.enable();
      this.activarValorReconocimiento(item.codigo, true);

    });
  }

  private activarValorReconocimiento(codigo, limpiar = false) {
    if(limpiar){ this.form.controls.valorReconocimiento.setValue(null); }
    if (codigo === GENERALES.TIPO_RECONOCIDO.PORCENTAJE) {
      this.showNombreComercialPlanCobertura = true;
      this.form.controls.valorReconocimiento.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.form.controls.nombreComercialPlanCobertura.setValidators([Validators.required]);
      this.valorMaximoProteccion = '100';
      this.optionsMask = percentMaskConfig;
      this.form.controls.valorReconocimiento.updateValueAndValidity();
      this.form.controls.valorReconocimiento.markAsTouched();
    } else {
      this.form.controls.nombreComercialPlanCobertura.setValidators(null);
      this.form.controls.nombreComercialPlanCobertura.reset();
      this.showNombreComercialPlanCobertura = false;
      this.form.controls.valorReconocimiento.setValidators([Validators.required, Validators.min(0), Validators.max(999999999999.99)]);
      this.valorMaximoProteccion = '999.999.999.999,99';
      this.optionsMask = numberMaskConfig;
      this.form.controls.valorReconocimiento.updateValueAndValidity();
      this.form.controls.valorReconocimiento.markAsTouched();
    }
  }

  private obtenerUnidad(codigo: string) {
    return this.unidades.find(res => res.codigo === codigo);
  }

  private planCoberturaHijo(codigo: number) {
    return this.nombresComercialesPlanCobertura.find(res => res.codigo === codigo);
  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  ngOnDestroy(): void {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura; // codigo;
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
        this._cargarDatosTabla(this.planCobertura.reconocimientosPermanencia);
      }));
  }

  async _toggle() {
    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });

      this._cerrarSeccion();
    }
  }

  private _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.reconocimientoPorPermanencia = undefined;
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
        _estado: item.estado ? 'Si' : 'No',
        _valorReconocimiento: item.valorReconocimiento.toString().includes('.')? item.valorReconocimiento.toString().replace('.', ',') : item.valorReconocimiento
      });
    }
    return listObj;
  }

  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.reconocimientoPermanencia.getReconocimientosPorPermanencia({
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
          this.store.dispatch(new PostReconocimientosPorPermanenciaAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay beneficionpreexistentes al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostReconocimientosPorPermanenciaAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  async _toggleGuardar(toggle: boolean, condicionesVentaPlanCobertura?: any) {
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
      if (condicionesVentaPlanCobertura) {
        this.reconocimientoPorPermanencia = JSON.parse(JSON.stringify(condicionesVentaPlanCobertura));
        this._esCreacion = false;
        this.initForm(this.reconocimientoPorPermanencia);
      } else {
        this.reconocimientoPorPermanencia = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  private async _cargarDatosDesplegables() {
    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    // Lista para el select de unidades
    const _unidades = await this.backService.tipoReconocido.getTipoReconocidos({
      estado: true,
      isPaged: true,
      sort: 'nombre,asc',
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.unidades = _unidades._embedded.mimTipoReconocido;

    // Lista para el select planCobertura
    const _planeCobeComercial = await this.backService.planCobertura.getPlanesCoberturas({
      'mimPlan.codigo': this.planCobertura.planCobertura.mimPlan.codigo,
      estado: true,
      isPaged: true,
      sort: 'nombre,asc',
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.nombresComercialesPlanCobertura = _planeCobeComercial.content;

  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  private _alEliminar($event: any) {
    const _codigo = $event.codigo;
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.reconocimientoPermanencia.deleteReconocimientoPorPermanencia(_codigo).subscribe((respuesta: any) => {
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
    const mimReconocimientoPorPermanencia = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      valorReconocimiento: form.valorReconocimiento && form.valorReconocimiento.toString().includes(',') ? +form.valorReconocimiento.replace(',', '.') : +form.valorReconocimiento,
      mimPlanCoberturaHijo: form.nombreComercialPlanCobertura ? { codigo: form.nombreComercialPlanCobertura.codigo } : null,
      mimTipoReconocido: form.unidad ? { codigo: form.unidad.codigo } : null,
      edadIngreso: form.edadIngreso,
      estado: true,
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: form.fechaInicioFechaFin.length > 1 ? DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy') : null,
    };

    this.backService.reconocimientoPermanencia.postReconocimientoPorPermanencia(mimReconocimientoPorPermanencia).subscribe((respuesta: any) => {
      // cerramos modal
      this.reconocimientosPorPermanencia = undefined;
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
    const _form: any = this.form.getRawValue();

    const mimReconocimientoPorPermanencia = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      codigo: this.reconocimientoPorPermanencia.codigo,
      valorReconocimiento: _form.valorReconocimiento && _form.valorReconocimiento.toString().includes(',') ? +_form.valorReconocimiento.replace(',', '.') : +_form.valorReconocimiento,
      mimPlanCoberturaHijo: _form.nombreComercialPlanCobertura ? { codigo: _form.nombreComercialPlanCobertura.codigo } : null,
      mimTipoReconocido: _form.unidad ? { codigo: _form.unidad.codigo } : null,
      edadIngreso: _form.edadIngreso || null,
      estado: _form.vigente,
      fechaInicio: DateUtil.dateToString(_form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: _form.fechaInicioFechaFin.length > 1 ? DateUtil.dateToString(_form.fechaInicioFechaFin[1], 'dd-MM-yyyy') : null,
    };

    this.backService.reconocimientoPermanencia.putReconocimientoPorPermanencia(
      this.reconocimientoPorPermanencia.codigo,
      mimReconocimientoPorPermanencia).subscribe((respuesta: any) => {

        // Cerramos el modal.
        this.reconocimientoPorPermanencia = undefined;
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
