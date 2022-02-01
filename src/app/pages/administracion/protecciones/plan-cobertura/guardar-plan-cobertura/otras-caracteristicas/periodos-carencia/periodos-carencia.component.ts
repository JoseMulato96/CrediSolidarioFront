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
import { Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { IMimPeriodoCarencia, MimPeriodoCarencia } from '../../../model/mim-periodo-carencia.model';
import { PostPeriodosCarenciaAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { PeriodosCarenciaConfig } from './periodos-carencia.config';

@Component({
  selector: 'app-periodos-carencia',
  templateUrl: './periodos-carencia.component.html'
})
export class PeriodosCarenciaComponent extends FormValidate implements OnInit, OnDestroy, AfterViewInit, FormComponent {
  /** Id de la seccion */
  id = 'periodosCarencia';

  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  form: FormGroup;
  isForm: Promise<any>;
  unidadTiempos: any[];
  causas: any[];
  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  configuracion: PeriodosCarenciaConfig = new PeriodosCarenciaConfig();

  dropdown: boolean;
  mostrarGuardar: boolean;
  periodoCarencia: any;

  noAplica: any = { codigo: null, nombre: this.translate.instant('global.na') };
  estado = true;
  estadoFecha: boolean;

  nombrePlan: any;
  nombreCobertura: any;


  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
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
        this._cargarDatosTabla(this.planCobertura.periodosCarencia);
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
        periodoCarencia: new FormControl(param ? param.periodoCarencia : null,
          [
            Validators.min(0),
            Validators.max(999)
          ]),

        unidadTiempo: new FormControl(param ?
          param.mimUnidadTiempo ?
            this.obtenerUnidadTiempo(param.mimUnidadTiempo.codigo)
            : this.noAplica
          : null),

        causa: new FormControl(param ?
          param.mimCausa ?
            this.obtenerCausa(param.mimCausa.codigo)
            : this.noAplica
          : null, [Validators.required]),

        numeroContribuciones: new FormControl(param ? param.contribuciones : null, [Validators.required,
        Validators.min(0),
        Validators.max(999)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
      })
    );

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }

    this.estadoFecha = this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO;
    if (this.planCobertura && this.planCobertura.planCobertura.mimEstadoPlanCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_PLAN_COBERTURA.INACTIVO) {
      this.form.disable();
    }

    if (this.estadoFecha) {
      this.form.controls.fechaInicioFechaFin.disable();
    }

    if (param && !param.estado && !this.estadoFecha) {
      this.form.disable();
      this.estadoFecha = !param.estado;
    }
  }

  private obtenerUnidadTiempo(codigo: any) {
    return this.unidadTiempos ? this.unidadTiempos.find(unidadTiempo => unidadTiempo.codigo === codigo) : null;
  }

  private obtenerCausa(codigo: any) {
    return this.causas ? this.causas.find(causa => causa.codigo === codigo) : null;
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

  _onClickCelda($event) {
    this._toggleGuardar(true, $event);
  }

  private disbledInputs() {
    this.form.controls.periodoCarencia.disable();
    this.form.controls.unidadTiempo.disable();
    this.form.controls.causa.disable();
    this.estadoFecha = true;
  }

  async _toggleGuardar(toggle: boolean, periodoCarencia?: any) {
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

      if (periodoCarencia) {
        this.periodoCarencia = JSON.parse(JSON.stringify(periodoCarencia));
        this._esCreacion = false;
        this.initForm(this.periodoCarencia);
        this.disbledInputs();
        this._setRowInactivo();
      } else {
        this.periodoCarencia = undefined;
        this._esCreacion = true;
        this.initForm();
      }

      this.mostrarGuardar = toggle;
    }
  }

  private async _cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;


    if (!this.unidadTiempos || !this.causas) {
      const _unidadesCarencia = await this.backService.unidadTiempo.obtenerUnidadesTiempo({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
      const _causas = await this.backService.causa.obtenerCausas({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));

      this.unidadTiempos = _unidadesCarencia._embedded.mimUnidadTiempo;
      this.causas = _causas._embedded.mimCausa;

      // Agregamos los items de N/A.
      this.unidadTiempos.push(this.noAplica);
      this.causas.push(this.noAplica);
    }
  }

  async _setRowInactivo() {
    if (!this._esCreacion && !this.obtenerUnidadTiempo(this.periodoCarencia.mimUnidadTiempo.codigo)) {
      this.unidadTiempos.push(this.periodoCarencia.mimUnidadTiempo);
    }
    if (!this._esCreacion && !this.obtenerCausa(this.periodoCarencia.mimCausa.codigo)) {
      this.causas.push(this.periodoCarencia.mimCausa);
    }
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {
    this.backService.periodoCarencia.obtenerPeriodosCarencia({
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
          this.store.dispatch(new PostPeriodosCarenciaAction(page, this.id, Estado.Pendiente));
        }
        return;
      }

      // Informamos que ya hay periodos de carencia al Redux para controlar el estado del componente.
      let estadoModulo = this.validarEstado(page.content) === undefined && (estado === 'false' || estado === '') ? Estado.Pendiente : Estado.Guardado;
      this.store.dispatch(new PostPeriodosCarenciaAction(page, this.id, estadoModulo));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  validarEstado(items: any) {
    return items.find(objec => objec.estado === true);
  }

  private _cargarDatosTabla(page: Page<MimPeriodoCarencia>) {
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
    const periodoCarencia = {
      mimPlanCobertura: {
        codigo: this.planCobertura.planCobertura.codigo
      },
      periodoCarencia: this.form.controls.periodoCarencia.value,
      contribuciones: this.form.controls.numeroContribuciones.value,
      fechaInicio: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy'),
      estado: true
    } as IMimPeriodoCarencia;


    if (this.form.controls.unidadTiempo.value && this.form.controls.unidadTiempo.value.codigo) {
      periodoCarencia.mimUnidadTiempo = {
        codigo: this.form.controls.unidadTiempo.value.codigo
      };
    }
    if (this.form.controls.causa.value && this.form.controls.causa.value.codigo) {
      periodoCarencia.mimCausa = {
        codigo: this.form.controls.causa.value.codigo
      };
    }

    this.backService.periodoCarencia.crearPeriodoCarencia(periodoCarencia).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.periodoCarencia = undefined;
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
    this.periodoCarencia.periodoCarencia = this.form.controls.periodoCarencia.value;
    this.periodoCarencia.contribuciones = this.form.controls.numeroContribuciones.value;
    this.periodoCarencia.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.periodoCarencia.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');

    if (this.form.controls.unidadTiempo.value && this.form.controls.unidadTiempo.value.codigo) {
      this.periodoCarencia.mimUnidadTiempo = {
        codigo: this.form.controls.unidadTiempo.value.codigo
      };
    } else {
      this.periodoCarencia.mimUnidadTiempo = null;
    }

    if (this.form.controls.causa.value && this.form.controls.causa.value.codigo) {
      this.periodoCarencia.mimCausa = {
        codigo: this.form.controls.causa.value.codigo
      };
    } else {
      this.periodoCarencia.mimUnidadTiempo = null;
    }

    this.backService.periodoCarencia.actualizarPeriodoCarencia(this.periodoCarencia.codigo, this.periodoCarencia).subscribe((respuesta: any) => {
      // Limpiamos el formulario.
      this.limpiarFormulario();
      // Cerramos el modal.
      this.periodoCarencia = undefined;
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
    this.periodoCarencia = undefined;
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

}
