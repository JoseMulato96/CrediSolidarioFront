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
import { Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { PostCoberturaAdicionalAction } from '../../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../../plan-cobertura.reducer';
import { CoberturasAdicionalesConfig } from './coberturas-adicionales.config';

@Component({
  selector: 'app-coberturas-adicionales',
  templateUrl: './coberturas-adicionales.component.html',
})
export class CoberturasAdicionalesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  idCoberturasAdicionales = 'coberturasAdicionales';
  _subs: Subscription[] = [];

  nombrePlan: any;
  nombreCobertura: any;

  planCobertura: GuardarPlanCobertura;
  adicionalForm: FormGroup;
  isAdicionalForm: Promise<any>;
  adicionalPlanCobertura: any;
  _esCreacionAdicional: boolean;
  configuracion: CoberturasAdicionalesConfig = new CoberturasAdicionalesConfig();
  mostrarGuardarAdicional: boolean;
  estadoFecha: boolean;
  planes: any[] = [];
  coberturasIndemnizadas: any;

  estado = true;
  condicionValidarEstado: any;
  mostrarGuardar: boolean;
  hayDatosGridAdicionales: boolean;
  coberturasIndemnizadasProceso: any[] = [];
  condiciones: any[];
  coberturasIndemnizadasPlanCobertura: any[] = [];
  coberturasSubsistentes: any[];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.hayDatosGridAdicionales = false;
  }

  ngOnInit() {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {

      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
      if (codigoPlanCobertura) {
        this._listar2(codigoPlanCobertura);
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

        this._cargarDatosTabla2(this.planCobertura.adicionalPlanCobertura);

        if (this.adicionalPlanCobertura) {
          const _mimAdicionalPlanCobertura = Object(this.planCobertura.adicionalPlanCobertura.content)
            .find(mimAdicionalPlanCobertura =>
              mimAdicionalPlanCobertura.codigo === this.adicionalPlanCobertura.codigo);
          this.adicionalPlanCobertura = _mimAdicionalPlanCobertura;
        }
      }));
  }

  private _cerrarSeccion() {

    this.mostrarGuardar = false;
    //this.subsistentePlanCoberturaDetalle = undefined;
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  // Listar para las coberturas adicionales
  private _listar2(codigoPlanCobertura: string, estado = true, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    this.backService.adicionalPlanCobertura.getAdicionalPlanesCoberturas({
      'mimPlanCobertura.codigo': codigoPlanCobertura,
      estado: estado ? 'true' : '',
      page: pagina,
      size: tamanio,
      sort: sort,
      isPaged: true,
    }).subscribe((page: any) => {

      this.configuracion.gridConfigAdicional.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        if (!this.hayDatosGridAdicionales) {
          if (estado) {
            this.store.dispatch(new PostCoberturaAdicionalAction(page, this.idCoberturasAdicionales, Estado.Pendiente));
          }
        }
        return;
      }
      this.hayDatosGridAdicionales = true;

      // Informamos que ya hay coberturas subsistentes al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstadoAdicional(page.content) === undefined && (!estado) ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostCoberturaAdicionalAction(page, this.idCoberturasAdicionales, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstadoAdicional(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private initAdicionalForm(param?: any) {
    this.isAdicionalForm = Promise.resolve(
      this.adicionalForm = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo: null),
        plan: new FormControl(param ? this.obtenerPlanSelected(param.mimPlan.codigo) : null, [Validators.required]),
        coberturaIndemnizada: new FormControl(param ? this.obtenerCoberturaIndemnizada(param.mimCoberturaIndemnizada.codigo) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
      })
    );

    this.estadoFecha = param && !param.estado || this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.adicionalForm.disable();
    } else {
      if (this._esCreacionAdicional) {
        this.adicionalForm.controls.vigente.setValue(true);
        this.adicionalForm.controls.vigente.disable();
        this.adicionalForm.controls.coberturaIndemnizada.disable();
      }
    }

    if (!this._esCreacionAdicional) {
      this.adicionalForm.controls.coberturaIndemnizada.disable();
      this.adicionalForm.controls.plan.disable();
      this.validarDisponibilidadEstadoAdicional();
    }
    this._onChangePlanesAdicional();
  }

  _onChangePlanesAdicional() {
    this.adicionalForm.controls.plan.valueChanges.subscribe(async planIte => {
      this.coberturasIndemnizadas = [];
      if(planIte){
        await this.desplegarCoberturasPorPlanCubrimientosAdicionales(planIte.codigo);
        this.adicionalForm.controls.coberturaIndemnizada.enable();
      }
    });
  }

  async desplegarCoberturasPorPlanCubrimientosAdicionales(codigoPlan: any) {
    this.coberturasIndemnizadas = null;
    this.coberturasIndemnizadasProceso = [];
    this.coberturasIndemnizadasPlanCobertura = [];
    if (this.adicionalPlanCobertura) {
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
    this.coberturasIndemnizadas = this.coberturasIndemnizadasProceso
      .filter(item => this.condiciones
        .find(condicion => condicion.mimPlanCobertura.codigo === item.codigo)
        && item.codigo != this.planCobertura.planCobertura.codigo);

    const coberturasSubsistentes = await this.backService.subsistentePlanCobertura.getSubsistentesPlanesCoberturas({
      'mimPlanCobertura.codigo': this.planCobertura.planCobertura.codigo,
      'estado': true
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    this.coberturasSubsistentes = coberturasSubsistentes.content;
    if (this.coberturasSubsistentes.length > 0) {
      this.coberturasIndemnizadas = this.coberturasIndemnizadas
        .filter(indemnizada => this.coberturasSubsistentes
          .find(subsistente => subsistente.mimCoberturaIndemnizada.codigo != indemnizada.mimCobertura.codigo
            && subsistente.mimPlan.codigo != indemnizada.mimCobertura.codigo));
    }
  }

  private _eliminar2(codigo: string) {
    this.backService.adicionalPlanCobertura.deleteAdicionalPlanCobertura(codigo).subscribe(resp => {
      this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
        this.frontService.alert.success(msn);
      });

      this._listar2(this.planCobertura.planCobertura.codigo, this.estado);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  _guardarAdicional() {
    if (this.adicionalForm.invalid) {
      this.validateForm(this.adicionalForm);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacionAdicional) {
      this._crearAdicional();
    } else {
      this._actualizarAdicional();
    }
  }

  _crearAdicional() {
    const mimAdicionalPlanCobertura = {
      mimPlan: { codigo: this.adicionalForm.controls.plan.value.codigo },
      mimCoberturaIndemnizada: { codigo: this.adicionalForm.controls.coberturaIndemnizada.value.mimCobertura.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: this.adicionalForm.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.adicionalForm.controls.fechaInicioFechaFin.value[0]),
      fechaFin: DateUtil.dateToString(this.adicionalForm.controls.fechaInicioFechaFin.value[1]),
    };

    this.backService.adicionalPlanCobertura.postAdicionalPlanCobertura(mimAdicionalPlanCobertura).subscribe((respuesta: any) => {
      // cerramos modal
      this.adicionalPlanCobertura = undefined;
      this.mostrarGuardarAdicional = false;
      this.limpiarFormulario();

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar2(this.planCobertura.planCobertura.codigo, this.estado);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizarAdicional() {
    const mimAdicionalPlanCobertura = {
      codigo:this.adicionalForm.controls.codigo.value,
      mimPlan: { codigo: this.adicionalForm.controls.plan.value.codigo },
      mimCoberturaIndemnizada: { codigo: this.adicionalForm.controls.coberturaIndemnizada.value.mimCobertura.codigo },
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      estado: this.adicionalForm.controls.vigente.value,
      fechaInicio: DateUtil.dateToString(this.adicionalForm.controls.fechaInicioFechaFin.value[0]),
      fechaFin: DateUtil.dateToString(this.adicionalForm.controls.fechaInicioFechaFin?.value[1]),
    };

    this.backService.adicionalPlanCobertura.putAdicionalPlanCobertura(
      mimAdicionalPlanCobertura.codigo, mimAdicionalPlanCobertura).subscribe((respuesta: any) => {

        // Cerramos el modal.
        this.adicionalPlanCobertura = undefined;
        this.mostrarGuardarAdicional = false;
        // Limpiamos el formulario.
        this.limpiarFormulario();

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            // Recargamos la informacion de la tabla.
            this._listar2(this.planCobertura.planCobertura.codigo, this.estado);

          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  validarDisponibilidadEstadoAdicional() {
    const _condicion = this.condicionValidarEstado[0];
    if (!_condicion.aplicaSubsistencia) {
      this.adicionalForm.controls.vigente.disable();
    }
  }

  private limpiarFormulario() {
    this.adicionalForm.reset();
    this.initAdicionalForm();
  }

  // Proceso para el incio de la creacion de los formularios y las coberturas adicionales
  async _toggleGuardar2(toggle: boolean, adicionalPlanCobertura?: any) {

    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardarAdicional = false;
          this.limpiarFormulario();
        }
      });
    } else {
      // Intentamos  cargaar los datos de los desplegables solo cuando se abra el formulario.
      // Ademas, si ya estan inicializados, no lo hacemos de nuevo.
      await this._cargarDatosDesplegables2();

      if (adicionalPlanCobertura) {
        this.adicionalPlanCobertura = JSON.parse(JSON.stringify(adicionalPlanCobertura)).dato;
        this._esCreacionAdicional = false;
        await this.desplegarCoberturasPorPlanCubrimientosAdicionales(this.adicionalPlanCobertura.mimPlan.codigo);
        await this.cargarCondicion(this.adicionalPlanCobertura.mimCoberturaIndemnizada.codigo);
        this.initAdicionalForm(this.adicionalPlanCobertura);
      } else {
        this.adicionalPlanCobertura = undefined;
        this._esCreacionAdicional = true;
        this.initAdicionalForm();
      }

      this.mostrarGuardarAdicional = toggle;
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

  private async _cargarDatosDesplegables2() {
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre; // _plan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre; // _cobertura.nombre;

    // Lista de planes

    const _planes = await this.backService.planes.getPlanes({
      'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO]
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

    this.planes = _planes.content;



  }

  // Estructura para cargar datos coberturas Adicionales
  private _cargarDatosTabla2(page: Page<any>) {
    if (!page || !page.content || page.content.length === 0) {
      return;
    }
    if (this.configuracion.gridConfigAdicional.component) {
      this.configuracion.gridConfigAdicional.component.limpiar();
      this.configuracion.gridConfigAdicional.component.cargarDatos(
        this._asignarEstados2(page.content), {
        maxPaginas: page.totalPages,
        pagina: page.number,
        cantidadRegistros: page.totalElements
      });
    }
  }

  _asignarEstados2(items: any) {
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

  _onSiguiente2($event) {
    this._obtenerDatosConEstados2($event, this.estado);
  }

  _onAtras2($event) {
    this._obtenerDatosConEstados2($event, this.estado);
  }

  _onClickCeldaElement2($event) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar2(true, $event);
    } else if ($event.col.key === 'eliminar') {
      this._alEliminar2($event.dato);
    }
  }

  private _alEliminar2($event: any) {
    const coberturaAdicional = $event.codigo;
    this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.deseaEliminarRow').subscribe((mensaje: string) => {
      this.frontService.alert.confirm(mensaje, 'danger').then((confirm) => {
        if (confirm) {
          this._eliminar2(coberturaAdicional);
        }
      });
    });
  }

  _obtenerEstado2(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion2 = obtenerSeccionPorId(this.idCoberturasAdicionales, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion2 ? seccion2.estado : Estado.Pendiente;
  }

  _onToggleStatus2($event) {
    this._obtenerDatosConEstados2($event, $event.currentTarget.checked);
  }

  _obtenerDatosConEstados2($event, estado: boolean) {
    this.estado = estado;
    this._listar2(this.planCobertura.planCobertura.codigo, this.estado, $event.pagina, $event.tamano, $event.sort);
  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  private obtenerPlanSelected(codigo: any) {
    return this.planes.find(planesItem => planesItem.codigo === codigo);
  }

  private obtenerCoberturaIndemnizada(codigo: string) {
    return this.coberturasIndemnizadas.find(coberturaIndemnizada => coberturaIndemnizada.mimCobertura.codigo === codigo);
  }

  hasChanges() {
    return (this.adicionalForm && this.adicionalForm.dirty);
  }

}
