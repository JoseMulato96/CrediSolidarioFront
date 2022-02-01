import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormValidate } from '@shared/util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { DateUtil } from '@shared/util/date.util';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { GENERALES } from '@shared/static/constantes/constantes';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-exclusiones-cobertura',
  templateUrl: './guardar-exclusiones-cobertura.component.html',
})
export class GuardarExclusionesCoberturaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoExclusion: string;
  codigoCobertura: string;
  exclusionItem: any;
  codigoCanalVenta: string;
  descripcion: any;

  coberturas: any[] = [];
  exclusionesItems: any[] = [];
  fondos: any[];
  codigoFondo: string;

  tipoTransaccion: any[];
  canalesVentas: any[] = [];
  unidadTiempos: any[];
  estadoFecha: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoExclusion = params.codigoExclusion;
      this.codigoCobertura = params.codigoCobertura;
      this.codigoFondo = params.codigoFondo;

      this.backService.fondo.getFondos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }).subscribe((resp: any) => {
        this.fondos = resp.content;
        if (this.codigoFondo) {
          this._changeFondo(this.codigoFondo);
        } else {
          this._initForm();
        }
      }, (err) => {
        this.form.reset();
        this._initForm();
        this.frontService.alert.warning(err.error.message);
      });

    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimExclusion.mimFondo.codigo) : this.codigoFondo ? this.fondoSelected(this.codigoFondo) : null, [Validators.required]),
        cobertura: new FormControl(param ? this.coberturaSelected(param.mimCobertura.codigo) : null, [Validators.required]),
        exclusion: new FormControl(param ? this.exclusionSelected(param.mimExclusion.codigo) : null, [Validators.required]),
        descripcion: new FormControl(),
        tipoTransaccion: new FormControl(param ? this.tipoTransaccionSelected(param.mimTransaccionExclusionCoberturaList) : null, [Validators.required]),
        canalesVentas: new FormControl(param ? this.canalVentaSelected(param.mimCanalVentaExclusionCoberturaList) : null, [Validators.required]),
        nroPeriodoDefinido: new FormControl(param && param.periodoDefinido ? param.periodoDefinido : null, [Validators.min(0), Validators.max(999)]),
        unidadTiempos: new FormControl(param && param.mimUnidadTiempo ? this.obtenerUnidadTiempo(param.mimUnidadTiempo.codigo) : null),
        contribucciones: new FormControl(param && param.contribucion ? param.contribucion : null, [Validators.min(0), Validators.max(999)]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    this.changeExclucuciones();
    this.form.controls.descripcion.disable();
    if (param) {
      this.disbabledForStatus(param.estado, param.mimExclusion.mimFondo.estado, param.mimCobertura.mimEstadoCobertura.codigo);
    }

    this.vigenciaFechasAMantenerSeleccionadas = undefined;
    if (!this._esCreacion) {
      this.form.controls.cobertura.disable();
      this.form.controls.exclusion.disable();
      this.form.controls.fondo.disable();
      this.estadoFecha = param && !param.estado;
      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
    }

  }

  disbabledForStatus(status: boolean, fondo?: any, cobertura?: any) {
    if (cobertura) {
      if (!fondo || cobertura === GENERALES.ESTADOS_COBERTURA.NO_DISPONIBLE) {
        this.form.controls.vigente.disable({ emitEvent: false });
      } else {
        this.form.controls.vigente.enable({ emitEvent: false });
      }
    }
    if (!status) {
      this.form.controls.tipoTransaccion.disable();
      this.form.controls.canalesVentas.disable();
      this.form.controls.nroPeriodoDefinido.disable();
      this.form.controls.contribucciones.disable();
      this.form.controls.unidadTiempos.disable();
      this.estadoFecha = true;
    } else {
      this.form.controls.tipoTransaccion.enable();
      this.form.controls.canalesVentas.enable();
      this.form.controls.nroPeriodoDefinido.enable();
      this.form.controls.contribucciones.enable();
      this.form.controls.unidadTiempos.enable();
      this.estadoFecha = false;
    }
  }

  changeExclucuciones() {
    this.form.controls.exclusion.valueChanges.subscribe(esDescripcion => {
      if (esDescripcion) {
        this.form.controls.descripcion.setValue(esDescripcion.descripcion);
      }
    });
    this.form.controls.vigente.valueChanges.subscribe(resp => {
      this.disbabledForStatus(resp);
    });
  }

  fondoSelected(codigo) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  tipoTransaccionSelected(items: any[]) {
    return this.tipoTransaccion.filter(tipoTransaccion => items.find(item =>
      item.mimTransaccion.codigo === tipoTransaccion.codigo));
  }

  canalVentaSelected(items: any[]) {
    return this.canalesVentas.filter(canalesVentas => items.find(item =>
      item.mimCanalVenta.codigo === canalesVentas.codigo));
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  coberturaSelected(codigo: string) {
    return this.coberturas.find(x => x.codigo === codigo);
  }

  exclusionSelected(codigo: string) {
    return this.exclusionesItems.find(x => x.codigo === codigo);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o eliminar
   */
  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      mimCobertura: { codigo: form.cobertura.codigo },
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      mimExclusion: { codigo: form.exclusion.codigo },
      mimTransaccionExclusionCoberturaList: form.tipoTransaccion.map(tipoTransaccion => {
        const codigo = { mimTransaccion: { codigo: tipoTransaccion.codigo } };
        return codigo;
      }),
      mimCanalVentaExclusionCoberturaList: form.canalesVentas.map(canalesVentas => {
        const codigo = { mimCanalVenta: { codigo: canalesVentas.codigo } };
        return codigo;
      }),
      periodoDefinido: this.form.controls.nroPeriodoDefinido.value,
      mimUnidadTiempo: this.form.controls.unidadTiempos.value ? {
        codigo: this.form.controls.unidadTiempos.value.codigo
      } : null,
      contribucion: form.contribucciones,
      estado: true
    };

    this.backService.exclusionCobertura.postExclusionCobertura(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del fondo
   */
  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      mimCobertura: { codigo: form.cobertura.codigo },
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      mimExclusion: { codigo: form.exclusion.codigo },
      mimTransaccionExclusionCoberturaList: form.tipoTransaccion.map(tipoTransaccion => {
        const codigo = { mimTransaccion: { codigo: tipoTransaccion.codigo } };
        return codigo;
      }),
      mimCanalVentaExclusionCoberturaList: form.canalesVentas.map(canalesVentas => {
        const codigo = { mimCanalVenta: { codigo: canalesVentas.codigo } };
        return codigo;
      }),
      periodoDefinido: this.form.controls.nroPeriodoDefinido.value,
      mimUnidadTiempo: this.form.controls.unidadTiempos.value ? {
        codigo: this.form.controls.unidadTiempos.value.codigo
      } : null,
      contribucion: form.contribucciones,
      estado: form.vigente,
    };

    this.backService.exclusionCobertura.putExclusionCobertura(this.codigoExclusion, this.codigoCobertura, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaListar();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_EXCLUSIONES_COBERTURA]);
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  _changeFondo(_codigoFondo?: string) {
    this.codigoFondo = _codigoFondo ? _codigoFondo : this.form.value.fondo.codigo;

    forkJoin([
      this.backService.cobertura.obtenerCoberturas({
        'mimFondo.codigo': this.codigoFondo,
        'mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO,
        isPaged: true, sort: 'nombre,asc', 'size': 1000000
      }),
      this.backService.exclusion.getExclusiones({ 'mimFondo.codigo': this.codigoFondo, estado: true,
        isPaged: true, sort: 'descripcion,asc', 'size': 1000000 }),
      this.backService.tiposMovimientos.getTiposMovimientos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
      this.backService.canal.getCanalesVentas({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
      this.backService.unidadTiempo.obtenerUnidadesTiempo({ estado: true })
    ]).subscribe(([
      _caberturas,
      _exclusiones,
      _tipoTransaccion,
      _canalesVentas,
      _unidadTiempos
    ]) => {
      this.coberturas = _caberturas.content;
      this.exclusionesItems = _exclusiones.content;
      this.tipoTransaccion = _tipoTransaccion._embedded.mimTipoMovimiento;
      this.canalesVentas = _canalesVentas._embedded.mimCanal;
      this.unidadTiempos = _unidadTiempos._embedded.mimUnidadTiempo;
      if (this.codigoExclusion && this.codigoCobertura) {
        this.backService.exclusionCobertura.getExclusionCobertura(this.codigoExclusion, this.codigoCobertura)
          .subscribe((resp: any) => {
            this.exclusionItem = resp;
            this._setRowInactivo(resp);
            this._esCreacion = false;
            this._initForm(resp);
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          });
      } else {
        this._esCreacion = true;
        this._initForm();
      }
    }, (err) => {
      this.form.reset();
      this._initForm();
      this.frontService.alert.warning(err.error.message);
    });
  }

  _setRowInactivo(row: any) {
    if (!this.fondoSelected(row.mimExclusion.mimFondo.codigo)) {
      this.fondos.push(row.mimExclusion.mimFondo);
    }

    if (!this.coberturaSelected(row.mimCobertura.codigo)) {
      this.coberturas.push(row.mimCobertura);
    }

    if (!this.exclusionSelected(row.mimExclusion.codigo)) {
      this.exclusionesItems.push(row.mimExclusion);
    }

    if (row.mimUnidadTiempo && !this.obtenerUnidadTiempo(row.mimUnidadTiempo.codigo)) {
      this.unidadTiempos.push(row.mimExclusion);
    }

    row.mimTransaccionExclusionCoberturaList.forEach(item => {
      if (item.mimTransaccion && !item.mimTransaccion.estado) {
        this.tipoTransaccion.push(item.mimTransaccion);
      }
    });

    row.mimCanalVentaExclusionCoberturaList.forEach(item => {
      if (item.mimCanalVenta && !item.mimCanalVenta.estado) {
        this.canalesVentas.push(item.mimCanalVenta);
      }
    });
  }

  private obtenerUnidadTiempo(codigo: any) {
    return this.unidadTiempos ? this.unidadTiempos.find(unidadTiempo => unidadTiempo.codigo === codigo) : null;
  }
}
