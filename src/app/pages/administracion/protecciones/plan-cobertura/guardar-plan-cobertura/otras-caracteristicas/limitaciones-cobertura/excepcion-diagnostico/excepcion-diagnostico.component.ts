import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { IMimExcepcionDiagnostico, MimExcepcionDiagnostico } from '../../../../model/mim-excepcion-diagnostico';
import { PostLimitacionCoberturaAction } from '../../../../plan-cobertura.actions';
import { ExcepcionDiagnosticoConfig } from './excepcion-diagnostico.config';

@Component({
  selector: 'app-excepcion-diagnostico',
  templateUrl: './excepcion-diagnostico.component.html',
  styleUrls: ['./excepcion-diagnostico.component.css']
})
export class ExcepcionDiagnosticoComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  diagnosticosEspecificos: any[];
  condicionesCoberturas: any[];
  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: ExcepcionDiagnosticoConfig = new ExcepcionDiagnosticoConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  excepcionDiagnostico: any;
  estado = true;
  estadoFecha: boolean;

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
        this._cargarDatosTabla(this.planCobertura.excepcionDiagnostico);
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
        diagnosticoEspecifico: new FormControl(param ? param.sipDiagnosticos ? param.sipDiagnosticos.diagCod + ' - ' + param.sipDiagnosticos.diagDesc : null : null, [Validators.required]),
        condicionCobertura: new FormControl(param ? param.mimCondicionCobertura ? this.obtenerCondicionCobertura(param.mimCondicionCobertura.codigo) : null : null),
        maximoDiasPagar: new FormControl(param ? param.maximoDiasPagar : null, [Validators.required, Validators.max(999)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    this.estadoFecha = this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.form.controls.diagnosticoEspecifico.disable();
      this.form.controls.condicionCobertura.disable();

      this.estadoFecha = param && !param.estado;
      if (this.estadoFecha) {
        this.form.disable();
        this.form.controls.vigente.enable();
      }

    }
    this._onChange();
  }

  private obtenerCondicionCobertura(codigo: any) {
    return this.condicionesCoberturas ? this.condicionesCoberturas.find(resp => resp.codigo === codigo) : null;
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

  private _eliminar(codigoExcepcionDiagnostico: string) {
    this.backService.excepcionDiagnostico.deleteExcepcionDiagnostico(codigoExcepcionDiagnostico)
      .subscribe(resp => {
        this.translate.get('global.eliminadoExitosoMensaje').subscribe(msn => {
          this.frontService.alert.success(msn);
        });

        this._listar(this.planCobertura.planCobertura.codigo);
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  async _toggleGuardar(toggle: boolean, excepcionDiagnostico?: any) {

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
      await this._cargarDatosDesplegables(excepcionDiagnostico);

      if (excepcionDiagnostico) {
        this.excepcionDiagnostico = JSON.parse(JSON.stringify(excepcionDiagnostico));
        this._esCreacion = false;
        this.initForm(this.excepcionDiagnostico);
      } else {
        this.excepcionDiagnostico = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  getDiagnosticos(event: any) {
    this.backService.diagnostico.getDiagnosticos(event.query).subscribe((response: any) => {
      this.diagnosticosEspecificos = response;
    });
  }

  private async _cargarDatosDesplegables(excepcionDiagnostico: any) {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    if (!this.condicionesCoberturas) {
      const _condicionesCoberturas = await this.backService.condicionCobertura.getCondicionesCoberturas({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      this.condicionesCoberturas = _condicionesCoberturas._embedded.mimCondicionCobertura;
    }
    if (excepcionDiagnostico) {
      this._setRowInactivo(excepcionDiagnostico);
    }
  }

  _setRowInactivo(dataRow: any) {
    if (!this._esCreacion && dataRow.mimCondicionCobertura && !this.obtenerCondicionCobertura(dataRow.mimCondicionCobertura.codigo)) {
      this.condicionesCoberturas.push(dataRow.mimCondicionCobertura);
    }
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {

    const param: any = { 'mimPlanCobertura.codigo': codigoPlanCobertura, estado: estado, page: pagina, size: tamanio, isPaged: true, sort: sort };

    this.backService.excepcionDiagnostico.getExcepcionesDiagnosticos(param).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.planCobertura.planCobertura.diasMaximoEvento,
          page,
          this.planCobertura.condicionPagoAntiguedad,
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
        page,
        this.planCobertura.condicionPagoAntiguedad,
        this.planCobertura.sublimiteCobertura,
        this.planCobertura.condicionesPagarEvento,
        'limitacionCobertura',
        Estado.Guardado
      ));

    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  private _cargarDatosTabla(page: Page<MimExcepcionDiagnostico>) {
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
        _diagnosticoCobertura: item.sipDiagnosticos && item.sipDiagnosticos.diagDesc ? item.sipDiagnosticos.diagDesc : item.mimCondicionCobertura.nombre
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
    const excepcionDiagnostico = {
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      maximoDiasPagar: this.form.controls.maximoDiasPagar.value,
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      estado: true
    } as IMimExcepcionDiagnostico;

    if (this.form.controls.diagnosticoEspecifico.value && this.form.controls.diagnosticoEspecifico.value.diagCod) {
      excepcionDiagnostico.sipDiagnosticos = {
        diagCod: this.form.controls.diagnosticoEspecifico.value.diagCod
      };
    }

    if (this.form.controls.condicionCobertura.value && this.form.controls.condicionCobertura.value.codigo) {
      excepcionDiagnostico.mimCondicionCobertura = {
        codigo: this.form.controls.condicionCobertura.value.codigo
      };
    }

    this.backService.excepcionDiagnostico.postExcepcionDiagnostico(excepcionDiagnostico).subscribe((respuesta: any) => {

      // Cerramos el modal.
      this.excepcionDiagnostico = undefined;
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
    this.excepcionDiagnostico.maximoDiasPagar = this.form.controls.maximoDiasPagar.value;
    this.excepcionDiagnostico.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    this.excepcionDiagnostico.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.excepcionDiagnostico.estado = this.form.controls.vigente.value;

    this.backService.excepcionDiagnostico.putExcepcionDiagnostico(this.excepcionDiagnostico.codigo, this.excepcionDiagnostico).subscribe((respuesta: any) => {
      // Cerramos el modal.
      this.excepcionDiagnostico = undefined;
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
    this.excepcionDiagnostico = undefined;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  _onChange() {
    this.form.controls.diagnosticoEspecifico.valueChanges.subscribe(diagnostico => {
      if (diagnostico) {
        this.form.controls.condicionCobertura.setValue(null);
        this.form.controls.condicionCobertura.setErrors(null);
        this.form.controls.diagnosticoEspecifico.setErrors({ 'required': true });
        this.form.controls.diagnosticoEspecifico.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.form.controls.condicionCobertura.valueChanges.subscribe(antiguedad => {
      if (antiguedad) {
        this.form.controls.diagnosticoEspecifico.setValue(null);
        this.form.controls.diagnosticoEspecifico.setErrors(null);
        this.form.controls.condicionCobertura.setErrors({ 'required': true });
        this.form.controls.condicionCobertura.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

}
