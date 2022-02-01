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
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { masksPatterns } from '@shared/util/masks.util';
import { from, Subscription } from 'rxjs';
import { Estado } from '../../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../../model/guardar-plan-cobertura.model';
import { IMimSublimiteCobertura, MimSublimiteCobertura } from '../../../../model/mim-sublimite-cobertura.model';
import { PostLimitacionCoberturaAction } from '../../../../plan-cobertura.actions';
import { SublimiteOtraCoberturaConfig } from './sublimite-otra-cobertura.config';

@Component({
  selector: 'app-sublimite-otra-cobertura',
  templateUrl: './sublimite-otra-cobertura.component.html',
  styleUrls: ['./sublimite-otra-cobertura.component.css']
})
export class SublimiteOtraCoberturaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  configuracion: SublimiteOtraCoberturaConfig = new SublimiteOtraCoberturaConfig();

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;
  patterns = masksPatterns;
  codigoPlanCobertura: string;
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];
  filtroEstadoLista = true;
  tipomask: string;
  selection = false;
  tipo: boolean;
  mostrarGuardar: boolean;
  tiposSublimites: any[];
  unidades: any[] = [];
  mostrarUnidad: boolean;
  presentaciones: any[] = [];

  vigenciaFechasAMantenerSeleccionadas: Date[];
  dropdown: boolean;

  nombrePlan: any;
  nombreCobertura: any;
  valorMaximoSublimite;

  sublimiteOtraCobertura: any;

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
        this._cargarDatosTabla(this.planCobertura.sublimiteCobertura);
      }));
  }


  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    this.sublimiteOtraCobertura = undefined;
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

  private _cargarDatosTabla(page: Page<MimSublimiteCobertura>) {
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

  _selecionTipoSublimite() {
    this.form.controls.tipoSublimite.valueChanges.subscribe((seleccion) => {
      this.selection = true;
      if (seleccion) {
        this.activarValorSublimite(seleccion.codigo);
      }
      if (seleccion.codigo === MIM_PARAMETROS.MIM_SUBLIMITE_COBERTURA.TIPO_SUBLIMITE_DEFINIDO) {
        this.mostrarUnidad = true;
        this.form.controls.unidad.setValidators(Validators.required);
      }
      if (seleccion.codigo !== MIM_PARAMETROS.MIM_SUBLIMITE_COBERTURA.TIPO_SUBLIMITE_DEFINIDO) {
        this.mostrarUnidad = false;
        this.form.controls.unidad.setValue(null);
        this.form.controls.unidad.setErrors(null);

      }
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
    this.translate.get('administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.limitacionCobertura.sublimiteOtraCobertura.eliminar.mensajeEliminar').subscribe((text: string) => {
      const modalPromise = this.frontService.alert.confirm(text, 'danger');
      const newObservable = from(modalPromise);
      newObservable.subscribe(
        (desition: any) => {
          if (desition === true) {
            this.backService.sublimiteCobertura.eliminarSublimiteCobertura($event.codigo).subscribe((respuesta: any) => {
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
    const mimSublimiteCobertura = {
      nombre: form.nombre,
      estado: Boolean(SIP_PARAMETROS_TIPO.ESTADO_ACTIVO),
      valor: form.valor,
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      mimPlanCobertura: { codigo: this.planCobertura.planCobertura.codigo },
      mimTipoSublimites: { codigo: form.tipoSublimite.codigo },
      mimPresentacionPortafolio: { codigo: form.presentacionValorAsegurado.codigo },
      mimTipoReconocido: form.unidad ? { codigo: form.unidad.codigo } : null
    } as IMimSublimiteCobertura;

    this.backService.sublimiteCobertura.guardarSublimitesCobertura(mimSublimiteCobertura).subscribe((respuesta: any) => {
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
    const form: any = this.form.value;
    this.sublimiteOtraCobertura.nombre = form.nombre;
    this.sublimiteOtraCobertura.valor = form.valor;
    this.sublimiteOtraCobertura.fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    this.sublimiteOtraCobertura.fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    this.sublimiteOtraCobertura.mimPlanCobertura = { codigo: this.planCobertura.planCobertura.codigo };
    this.sublimiteOtraCobertura.mimTipoSublimites = { codigo: form.tipoSublimite.codigo };
    form.unidad != null ? this.sublimiteOtraCobertura.mimTipoReconocido = { codigo: form.unidad.codigo } : this.sublimiteOtraCobertura.mimTipoReconocido = null;
    this.sublimiteOtraCobertura.mimPresentacionPortafolio = { codigo: form.presentacionValorAsegurado.codigo };

    this.backService.sublimiteCobertura.actualizarSublimiteCobertura(this.sublimiteOtraCobertura.codigo, this.sublimiteOtraCobertura).subscribe((respuesta: any) => {
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



  async _toggleGuardar(toggle: boolean, sublimiteOtraCobertura?: any) {
    if (!toggle && this.hasChanges()) {
      this.frontService.alert.confirm(this.translate.instant('global.onDeactivate')).then((respuesta: boolean) => {
        if (respuesta) {
          this.mostrarGuardar = false;
          this.limpiarFormulario();
        }
      });
    } else {
      this.selection = false;
      if (!this.tiposSublimites) {
        await this.cargarDatosDesplegables();
      }
      if (sublimiteOtraCobertura) {
        this.sublimiteOtraCobertura = JSON.parse(JSON.stringify(sublimiteOtraCobertura));
        this._esCreacion = false;
        this.initForm(this.sublimiteOtraCobertura);
      } else {
        this.sublimiteOtraCobertura = undefined;
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
    this.selection = false;
    this.form.reset();
    this.initForm();
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')]),
        tipoSublimite: new FormControl(param ? this.obtenerTipoSublimite(param.mimTipoSublimites.codigo) : null, [Validators.required]),
        unidad: new FormControl(param ? param.mimTipoReconocido ? this.obtenerUnidad(param.mimTipoReconocido.codigo) : null : null),
        valor: new FormControl(param ? param.valor : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        presentacionValorAsegurado: new FormControl(param && param.mimPresentacionPortafolio ? this.obtenerPresentaciones(param.mimPresentacionPortafolio.codigo) : null, [Validators.required]),
      })
    );
    this._selecionTipoSublimite();

    if (!param) {
      this.mostrarUnidad = false;
    }
    if (param && param.mimTipoReconocido != null) {
      this.mostrarUnidad = true;
    }

    if (param && param.mimTipoSublimites.codigo) {
      this.activarValorSublimite(param.mimTipoSublimites.codigo);
    }
  }

  private obtenerUnidad(codigo: any) {
    return this.unidades ? this.unidades.find(unidad => unidad.codigo === codigo) : null;
  }

  private obtenerPresentaciones(codigo: any) {
    return this.presentaciones ? this.presentaciones.find(pre => pre.codigo === codigo) : null;
  }
  private obtenerTipoSublimite(codigo: any) {
    return this.tiposSublimites ? this.tiposSublimites.find(tipoValorSublimite => tipoValorSublimite.codigo === codigo) : null;
  }

  private activarValorSublimite(codigo) {
    this.selection = true;
    if (codigo === MIM_PARAMETROS.MIM_SUBLIMITE_COBERTURA.TIPO_SUBLIMITE_PORCENTAJE) {
      this.tipo = true;
      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.valorMaximoSublimite = '100';
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
    } else {
      this.tipo = false;
      this.form.controls.valor.setValidators([Validators.required, Validators.min(0), Validators.max(9999999999999.99)]);
      this.valorMaximoSublimite = '9.999.999.999.999,99';
      this.form.controls.valor.updateValueAndValidity();
      this.form.controls.valor.markAsTouched();
    }
  }

  private async cargarDatosDesplegables() {

    // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
    this.nombrePlan = this.planCobertura.planCobertura.mimPlan.nombre;
    this.nombreCobertura = this.planCobertura.planCobertura.mimCobertura.nombre;

    const _tipoSublimitest = await this.backService.tipoSublimite.obtenerTiposSublimites({ estado: true, sort: 'nombre,asc' }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.tiposSublimites = _tipoSublimitest._embedded.mimTipoSublimites;

    const _unidades = await this.backService.tipoReconocido.getTipoReconocidos({
      estado: true,
      isPaged: true,
      sort: 'nombre,asc',
      size: 1000000
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    this.unidades = _unidades._embedded.mimTipoReconocido.filter(item => item.codigo !== MIM_PARAMETROS.MIM_TIPO_RECONOCIDO.PORCENTAJE);

    const _presentaciones = await this.backService.presentacionValorPortafolio.getPresentacionesValorPortafolio({
      estado: true,
    }).toPromise().catch(err => this.frontService.alert.error(err.error.message));
    const _presentacionesFilter = _presentaciones._embedded.mimPresentacionPortafolio;
    _presentacionesFilter.forEach(element => {
      if(element.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.VALOR_PERIODO || element.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.SI_AMPARA || element.codigo === MIM_PARAMETROS.MIM_PRESENTACION_PORTAFOLIO.VALOR_ASEGURADO){
        this.presentaciones.push(element);
      }
    });

  }

  private rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  _listar(codigoPlanCobertura: string, estado: any, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc') {
    const queryListaPorEstado = estado ? { 'mimPlanCobertura.codigo': codigoPlanCobertura, estado: estado, page: pagina, size: tamanio, isPaged: true, sort: sort } :
      { 'mimPlanCobertura.codigo': codigoPlanCobertura, page: pagina, size: tamanio, isPaged: true, sort: sort };
    this.backService.sublimiteCobertura.obtenerSublimitesCobertura(queryListaPorEstado).subscribe((page: any) => {

      this.configuracion.gridConfig.component.limpiar();

      if (!page || !page.content || page.content.length === 0) {
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.planCobertura.planCobertura.diasMaximoEvento,
          this.planCobertura.excepcionDiagnostico,
          this.planCobertura.condicionPagoAntiguedad,
          page,
          this.planCobertura.condicionesPagarEvento,
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
        page,
        this.planCobertura.condicionesPagarEvento,
        'limitacionCobertura',
        Estado.Guardado
      ));
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

}
