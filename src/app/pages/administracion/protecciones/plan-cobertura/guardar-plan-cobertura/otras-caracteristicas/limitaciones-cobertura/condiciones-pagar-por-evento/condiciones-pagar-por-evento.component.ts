import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@shared/interfaces/page.interface';
import { currencyMaskConfig, percentMaskConfig } from '@shared/static/constantes/currency-mask';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { IMimCondicionesPagarEvento, MimCondicionesPagarEvento } from '../../../../model/mim-condiciones-pagar-evento.model';
import { PostLimitacionCoberturaAction } from '../../../../plan-cobertura.actions';
import { CondicionesPagarEventoConfig } from './condiciones-pagar-por-evento.config';

@Component({
  selector: 'app-condiciones-pagar-por-evento',
  templateUrl: './condiciones-pagar-por-evento.component.html',
  styleUrls: ['./condiciones-pagar-por-evento.component.css']
})
export class CondicionesPagarEventoComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  configuracion: CondicionesPagarEventoConfig = new CondicionesPagarEventoConfig();

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  patterns = masksPatterns;
  codigoPlanCobertura: string;
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  filtroEstadoLista = true;
  tipomask: string;
  mostrarGuardar: boolean;
  causas: any[];
  unidades: any[] = [];

  dropdown: boolean;

  nombrePlan: any;
  nombreCobertura: any;

  condicionesPagoEvento: any;
  estadoFecha: boolean;
  optionsPercentMaskConfig = percentMaskConfig;
  optionsCurrencyMaskConfig = currencyMaskConfig;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          this._cerrarSeccion();
          return;
        }
        this.planCobertura = ui;
        this._cargarDatosTabla(this.planCobertura.condicionesPagarEvento);
      }));
  }


  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.condicionesPagoEvento = undefined;
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

  private _cargarDatosTabla(page: Page<MimCondicionesPagarEvento>) {
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

  _onSiguiente($event: any) {
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista, $event.pagina, $event.tamano);
  }

  _onAtras($event: any) {
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista, $event.pagina, $event.tamano);
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
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


  _onClickCeldaElement($event: any) {
    if ($event.col.key === 'editar') {
      this._toggleGuardar(true, $event.dato);
    } else {
      this._alEliminar($event.dato);
    }
  }

  _onToggleStatus($event: any) {
    this.filtroEstadoLista = $event.currentTarget.checked;
    this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
  }

  private _alEliminar($event: any) {
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.condicionesPagarEvento.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.condicionPagoEvento.eliminarCondicionPagoEvento($event.codigo).subscribe((respuesta: any) => {
              this.translate.get('global.eliminadoExitosoMensaje').subscribe((texto: string) => {
                this.frontService.alert.success(texto).then(() => {
                  // Recargamos la informacion de la tabla.
                  this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
                });
              });
            });
          }
        });
    });
  }


  _crear() {
    const form: any = this.form.value;
    const mimCondicionesPagarEvento = {
      estado: true,
      valor: form.valor,
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimCausa: { codigo: form.causa.codigo },
      mimUnidad: { codigo: form.unidad.codigo }
    } as IMimCondicionesPagarEvento;

    this.backService.condicionPagoEvento.guardarMimCondicionPagoEvento(mimCondicionesPagarEvento).subscribe((respuesta: any) => {
      this.limpiarFormulario();
      this.mostrarGuardar = false;

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }


  _actualizar() {
    this.condicionesPagoEvento.valor = this.form.controls.valor.value;
    this.condicionesPagoEvento.fechaInicio = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[0], 'dd-MM-yyyy');
    this.condicionesPagoEvento.fechaFin = DateUtil.dateToString(this.form.controls.fechaInicioFechaFin.value[1], 'dd-MM-yyyy');
    this.condicionesPagoEvento.mimPlanCobertura = { codigo: this.planCobertura.planCobertura.codigo };
    this.condicionesPagoEvento.mimCausa = { codigo: this.form.controls.causa.value.codigo };
    this.condicionesPagoEvento.mimUnidad = { codigo: this.form.controls.unidad.value.codigo };
    this.condicionesPagoEvento.estado = this.form.controls.vigente.value;

    this.backService.condicionPagoEvento.actualizarCondicionPagoEvento(this.condicionesPagoEvento.codigo, this.condicionesPagoEvento).subscribe((respuesta: any) => {
      this.limpiarFormulario();
      this.mostrarGuardar = false;

      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          // Recargamos la informacion de la tabla.
          this._listar(this.planCobertura.planCobertura.codigo, this.filtroEstadoLista);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }



  async _toggleGuardar(toggle: boolean, condicionesPagoEvento?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      await this.cargarDatosDesplegables();

      if (condicionesPagoEvento) {
        this.condicionesPagoEvento = JSON.parse(JSON.stringify(condicionesPagoEvento));
        this._esCreacion = false;
        this.initForm(this.condicionesPagoEvento);
      } else {
        this.condicionesPagoEvento = undefined;
        this._esCreacion = true;
        this.initForm();
      }
      this.mostrarGuardar = toggle;
    }

  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  limpiarFormulario() {
    this.form.reset();
    this.initForm();
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        causa: new FormControl(param ? this.obtenerCausas(param.mimCausa.codigo) : null, [Validators.required]),
        unidad: new FormControl(param ? param.mimUnidad ? this.obtenerUnidad(param.mimUnidad.codigo) : null : null, [Validators.required]),
        valor: new FormControl(param ? param.valor : null, [Validators.required,Validators.min(0), Validators.maxLength(13)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      })
    );

    if (!this._esCreacion) {
      this.estadoFecha = param && !param.estado;
      if (this.estadoFecha) {
        this.form.disable();
        this.form.controls.vigente.enable();
      }
    }
  }

  private obtenerUnidad(codigo: any) {
    return this.unidades ? this.unidades.find(unidad => unidad.codigo === codigo) : null;
  }

  private obtenerCausas(codigo: any) {
    return this.causas ? this.causas.find(causa => causa.codigo === codigo) : null;
  }


  private async cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    const _causas = await this.backService.causa.obtenerCausas({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.causas = _causas._embedded.mimCausa;

    const _unidades = await this.backService.tipoReconocido.getTipoReconocidos({
      estado: true,
      isPaged: true,
      sort: 'nombre,asc',
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.unidades = _unidades._embedded.mimTipoReconocido.filter(item => item.codigo != MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.PORCENTAJE);

  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  _listar(codigoPlanCobertura: string, estado: any, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    const queryListaPorEstado = estado ? { 'mimPlanCobertura.codigo': codigoPlanCobertura, estado: estado, page: pagina, size: tamanio, isPaged: true, sort: sort } :
      { 'mimPlanCobertura.codigo': codigoPlanCobertura, page: pagina, size: tamanio, isPaged: true, sort: sort };
    this.backService.condicionPagoEvento.obtenerCondicionPagoEvento(queryListaPorEstado).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.planCobertura.planCobertura.diasMaximoEvento,
          this.planCobertura.excepcionDiagnostico,
          this.planCobertura.condicionPagoAntiguedad,
          this.planCobertura.sublimiteCobertura,
          page,
          'limitacionCobertura',
          Estado.Pendiente
        ));
        return;
      }
      // Informamos que ya hay sublimites coberturas al Redux para controlar el estado del componente.
      this.store.dispatch(new PostLimitacionCoberturaAction(
        this.planCobertura.planCobertura.diasMaximoEvento,
        this.planCobertura.excepcionDiagnostico,
        this.planCobertura.condicionPagoAntiguedad,
        this.planCobertura.sublimiteCobertura,
        page,
        'limitacionCobertura',
        Estado.Guardado
      ));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

}
