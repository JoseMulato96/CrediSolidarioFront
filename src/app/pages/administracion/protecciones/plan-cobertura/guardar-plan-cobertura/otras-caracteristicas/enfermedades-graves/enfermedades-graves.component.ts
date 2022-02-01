import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnfermedadesGravesConfig } from './enfermedades-graves.config';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { PostEnfermedadGravePlanCoberturaAction } from '../../../plan-cobertura.actions';
import { Page } from '@shared/interfaces/page.interface';
import { DateUtil } from '@shared/util/date.util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { currencyMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-enfermedades-graves',
  templateUrl: './enfermedades-graves.component.html',
})
export class EnfermedadesGravesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  /** Id de la seccion */
  id = 'enfermedadesGraves';
  configuracion: EnfermedadesGravesConfig = new EnfermedadesGravesConfig();
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  crear: boolean;
  editar: boolean;

  dropdown: boolean;
  mostrarGuardar: boolean;
  estado = true;

  enfermedadGravePlanCobertura: any;

  enfermedadesGravesTotales: any[];
  enfermedadesGravesActualizar: any[];
  enfermedadesGraves: any[];
  tiposValorProteccion: any[];
  enfermedadesGravesPlanCobertura: any[];
  planCoberturaRespons: any;

  estadoCrear = true;
  estadoFecha: boolean;
  selection = false;

  abre: boolean;
  tipoValorProteccionn: boolean;
  tipoValorFijo: boolean;
  tipoValorAseguradoProteccion: boolean;

  valorMaximoProteccion;
  optionsMask;

  nombrePlan: any;
  nombreCobertura: any;


  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) {
    super();
  }


  hasChanges() {
    return this.form && this.form.dirty;
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        enfermedadGrave: new FormControl(param ? this.obtenerEnfermedadGrave(param.dato.mimEnfermedadGrave.codigo) : null, [Validators.required]),
        tipoValorProteccion: new FormControl(param ? this.obtenerTipoValorProteccion(param.dato.mimTipoValorProteccion.codigo) : null, [Validators.required]),
        valor: new FormControl(param ? param.dato.valor : null, [Validators.required]),
        vigente: new FormControl(param ? param.dato.estado : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.dato.fechaInicio, param.dato.fechaFin) : null, [Validators.required])
      })
    );

    this._selecionTipoValorReconocido();

    this.activarValorReconocido(param?.dato.mimTipoValorProteccion.codigo);

    if (this._esCreacion) {
      this.form.controls.vigente.setValue(true);
      this.form.controls.vigente.disable();
    }
    if (!this._esCreacion) {
      this.form.controls.enfermedadGrave.disable();
    }
  }

  private obtenerEnfermedadGrave(codigo: string) {
    this.enfermedadesGravesActualizar = this.agregarNombreObjecto(this.enfermedadesGravesActualizar);
    return this.enfermedadesGravesActualizar.find(re => re.codigo === codigo);
  }

  private obtenerTipoValorProteccion(codigo: any) {
    return this.tiposValorProteccion.find(res => res.codigo === codigo);
  }

  private rangoFechaSelected(fechaInicio: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaInicio), DateUtil.stringToDate(fechaFin)];
  }

  _selecionTipoValorReconocido() {
    this.form.controls.tipoValorProteccion.valueChanges.subscribe((seleccion) => {

      this.form.controls.valor.setValue(null);
      this.activarValorReconocido(seleccion?.codigo);

    });
  }

  private activarValorReconocido(codigo) {

    if (codigo === MIM_PARAMETROS.MIM_ENFERMEDAD_GRAVE.TIPO_VALOR_PROTECCION) {
      this.selection = true;

      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.valorMaximoProteccion = '100';
      this.optionsMask = percentMaskConfig;
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
      this.form.controls.valor.enable();
    }
    if (codigo ===  MIM_PARAMETROS.MIM_ENFERMEDAD_GRAVE.TIPO_VALOR_FIJO) {
      this.selection = true;

      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(9999999999999.99)]);
      this.valorMaximoProteccion = '9.999.999.999.999,99';
      this.optionsMask = currencyMaskConfig;
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
      this.form.controls.valor.enable();
    }
    if (codigo === MIM_PARAMETROS.MIM_ENFERMEDAD_GRAVE.TIPO_VALOR_ASEGURADO_PROTECCION) {
      this.selection = false;
      this.form.controls.valor.disable();
    }

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
        this._cargarDatosTabla(this.planCobertura.enfermedadGravePlanCobertura);
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
    this.enfermedadGravePlanCobertura = undefined;
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

  private agregarNombreObjecto(items: any) {
    const listObj = [];
    let item: any;
    for (item of items) {
      listObj.push({
        ...item,
        nombre: item.descripcion
      });
    }
    return listObj;
  }

  private _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.enfermedadGravePlanCobertura.getEnfermedadesGraves({
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
          this.store.dispatch(new PostEnfermedadGravePlanCoberturaAction(page, this.id, Estado.Pendiente));
        }
        return;
      }
      // Informamos que ya hay beneficionpreexistentes al Redux para controlar el estado del componente.
      const estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostEnfermedadGravePlanCoberturaAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true );
  }

  _onClickCeldaElement($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event);
    } else {
      this._alEliminar($event.dato);
    }
  }


  async _toggleGuardar(toggle: boolean, enfermedadGravePlanCobertura?: any) {
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
      if (enfermedadGravePlanCobertura) {
        this.enfermedadGravePlanCobertura = JSON.parse(JSON.stringify(enfermedadGravePlanCobertura));
        this._esCreacion = false;
        this.editar = true;
        this.crear = false;
        this.initForm(this.enfermedadGravePlanCobertura);
      } else {
        this.enfermedadGravePlanCobertura = undefined;
        this._esCreacion = true;
        this.editar = false;
        this.crear = true;
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

    // Lista de los registros de enfermedadesGravesPlanCobertura
    const _enfermedadesGravesPlanCobertura = await this.backService.enfermedadGravePlanCobertura.getEnfermedadesGraves({
      'estado': true,
      sort: 'mimEnfermedadGrave.descripcion,asc',
      isPaged: true,
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.enfermedadesGravesPlanCobertura = _enfermedadesGravesPlanCobertura.content;


    // Lista para el select de enfermedadesGraves
    const planCoberturaResponse = await this.backService.planCobertura.getPlanCobertura(this.planCobertura.planCobertura.codigo).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    const fondo = planCoberturaResponse.mimPlan.mimFondo.codigo;
    const _enfermedadesGraves = await this.backService.enfermedadGrave.getEnfermedadGraves({
      'mimEnfermedadGrave.estado': true,
      'mimFondo.codigo': fondo,
      sort: 'descripcion,asc'
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.enfermedadesGraves = this.agregarNombreObjecto(_enfermedadesGraves.content);
    this.enfermedadesGravesActualizar = _enfermedadesGraves.content;

    if (this.enfermedadesGravesPlanCobertura !== null) {
      this.enfermedadesGravesTotales = _enfermedadesGraves.content;
      const repetidas: any[] = [];
      for (let i = 0; i < this.enfermedadesGravesTotales.length; i++) {
        const enfermTotales = this.enfermedadesGravesTotales[i];
        for (let a = 0; a < this.enfermedadesGravesPlanCobertura.length; a++) {
          const regEnfermPlCo = this.enfermedadesGravesPlanCobertura[a];
          if (enfermTotales.nombre === regEnfermPlCo.mimEnfermedadGrave.nombre) {
            repetidas.push(enfermTotales);
            this.borrarSelect(enfermTotales);
          }
        }
      }
    }

    // Lista para el select de tipoValorProteccion
    const _tiposValorProteccion = await this.backService.tipoValorProteccion.obtenerTiposValorProteccion({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.tiposValorProteccion = _tiposValorProteccion._embedded.MimTipoValorProteccion;

  }


  borrarSelect(item) {
    this.enfermedadesGraves = this.enfermedadesGraves.filter(va => va !== item);
  }

  _onSiguiente($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  _onAtras($event) {
    this._obtenerDatosConEstados($event, this.estado);
  }

  limpiarFormularioDetalle() {
    this.enfermedadGravePlanCobertura = undefined;
    this.form.reset();
    this.initForm();
    this.selection = false;
    this.tipoValorAseguradoProteccion = false;
    this.tipoValorProteccionn = false;
    this.tipoValorFijo = false;
  }

  private _alEliminar($event: any) {
    const enfermedadGrave = $event.mimEnfermedadGrave.codigo;
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.enfermedadGravePlanCobertura.deleteEnfermedadGrave(this.planCobertura.planCobertura.codigo, enfermedadGrave).subscribe((respuesta: any) => {
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
    const mimEnfermedadGravePlanCobertura = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimEnfermedadGrave: { codigo: form.enfermedadGrave.codigo },
      mimTipoValorProteccion: { codigo: form.tipoValorProteccion.codigo },
      valor: this.form.controls.valor.value === null ? undefined : this.form.controls.valor.value,
      estado: this.form.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.enfermedadGravePlanCobertura.postEnfermedadGrave(mimEnfermedadGravePlanCobertura).subscribe((respuesta: any) => {
      // cerramos modal
      this.enfermedadGravePlanCobertura = undefined;
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
    const enfermedadGravePlanCobertura = {
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimEnfermedadGrave: { codigo: this.enfermedadGravePlanCobertura.dato.mimEnfermedadGrave.codigo },
      mimTipoValorProteccion: { codigo: this.form.controls.tipoValorProteccion.value.codigo },
      valor: this.form.controls.valor.value === null ? null : this.form.controls.valor.value,
      estado: this.form.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
    };

    this.backService.enfermedadGravePlanCobertura.putEnfermedadGrave(
      this.planCobertura.planCobertura.codigo,
      this.enfermedadGravePlanCobertura.dato.mimEnfermedadGrave.codigo,
      enfermedadGravePlanCobertura).subscribe((respuesta: any) => {

        // Cerramos el modal.
        this.enfermedadGravePlanCobertura = undefined;
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
