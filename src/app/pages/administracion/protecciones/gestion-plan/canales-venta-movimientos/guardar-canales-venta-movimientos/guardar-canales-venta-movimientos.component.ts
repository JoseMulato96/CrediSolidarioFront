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
import { CanalesVentaMovimientosService } from '../services/canales-venta-movimientos.service';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-canales-venta-movimientos',
  templateUrl: './guardar-canales-venta-movimientos.component.html',
})
export class GuardarCanalesVentaMovimientosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoPlan: string;
  codigoCanalVenta: string;
  fondo: any;
  plan: any;
  tipoPlan: any;

  canalesVentas: any[] = [];
  // canalVentaMovimiento: any[] = [];
  canalVentaMovimiento: any;
  fondos: any[] = [];
  planes: any[] = [];
  tiposMovientos: any[] = [];
  estadoFecha: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly canalesVentaMovimientoService: CanalesVentaMovimientosService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlan = params['codigoPlan'];
      this.codigoCanalVenta = params['codigoCanalVenta'];
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.canal.getCanalesVentas({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.tiposMovimientos.getTiposMovimientos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 })
      ]).subscribe(([
        _fondos,
        _canalesVentas,
        _tiposMovientos
      ]) => {
        this.fondos = _fondos.content;
        this.canalesVentas = _canalesVentas._embedded.mimCanal;
        this.tiposMovientos = _tiposMovientos._embedded.mimTipoMovimiento;
        if (this.codigoPlan && this.codigoCanalVenta) {
          this.canalesVentaMovimientoService.getCanalVentaMovimiento(this.codigoPlan, this.codigoCanalVenta)
            .subscribe((resp: any) => {
              this.canalVentaMovimiento = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this._changeFondo(resp.mimPlan.mimFondo.codigo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    });
  }

  _setRowInactivo(row: any) {
    if (!this.fondoSelected(row.mimPlan.mimFondo.codigo)) {
      this.fondos.push(row.mimPlan.mimFondo);
    }

    if (!this.canalVentaSelected(row.mimPlanCanalVentaPK.codigoCanalVenta)) {
      this.canalesVentas.push(row.mimCanalVenta);
    }

    row.mimMovimientoPlanCanalList.forEach((item) => {
      if (item.mimTipoMovimiento && !item.mimTipoMovimiento.estado) {
        this.tiposMovientos.push(item.mimTipoMovimiento);
      }
    });

  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimPlan.mimFondo.codigo) : null, [Validators.required]),
        plan: new FormControl(param ? this.planSelected(param.mimPlanCanalVentaPK.codigoPlan) : null, [Validators.required]),
        canalVenta: new FormControl(param ? this.canalVentaSelected(param.mimPlanCanalVentaPK.codigoCanalVenta) : null, [Validators.required]),
        tipoMovimiento: new FormControl(param ? this.tipoMovimientoSelected(param.mimMovimientoPlanCanalList) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.fondo.disable();
      this.form.controls.plan.disable();

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(param ? param.fechaInicio : null)];
      this.estadoFecha = param && !param.estado;
      if (param && !param.estado) {
        this.form.disable();
      }
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del plan
   * @param codigo Codigo del plan
   */
  planSelected(codigo: string) {
    return this.planes.find(x => x.codigo === codigo);
  }

  canalVentaSelected(codigo: string) {
    return this.canalesVentas.find(x => x.codigo === codigo);
  }

  tipoMovimientoSelected(items: any[]) {
    return this.tiposMovientos.filter(tipoMovimiento => items.find(item =>
      item.mimMovimientoPlanCanalPK.codigoTipoMovimiento === tipoMovimiento.codigo));
  }

  /**
   * Autor: Cesar Millan
   * @param fechaIni Fecha de inicio
   * @param fechaFin Fecha final
   */
  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
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
   * Función: Crea un canal de venta
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      estado: true,
      mimPlan: {
        codigo: form.plan.codigo
      },
      mimCanalVenta: {
        codigo: form.canalVenta.codigo
      },
      mimMovimientoPlanCanalList: form.tipoMovimiento.map(tipoMovimiento => {
        const codigo = { mimTipoMovimiento: { codigo: tipoMovimiento.codigo } };
        return codigo;
      })
    };

    this.canalesVentaMovimientoService.postCanalVentaMovimiento(param).subscribe((resp: any) => {
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
   * Función: Modifica la información del canal de ventas
   */
  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      estado: this.canalVentaMovimiento.estado,
      mimPlan: {
        codigo: this.codigoPlan
      },
      mimCanalVenta: {
        codigo: this.codigoCanalVenta
      },
      mimMovimientoPlanCanalList: form.tipoMovimiento.map(tipoMovimiento => {
        const codigo = { mimTipoMovimiento: { codigo: tipoMovimiento.codigo } };
        return codigo;
      })
    };

    this.canalesVentaMovimientoService.putCanalVentaMovimiento(this.codigoPlan, this.codigoCanalVenta, param).subscribe((resp: any) => {
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
   * Función: Retorna a la pantalla de listar de los canales de ventas
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_CANAL_VENTAS_MOVIMIENTO
    ]);
  }

  _changeFondo(codigoFondo?: string) {
    const codigo = codigoFondo != null && codigoFondo !== '' ? codigoFondo : this.form.value.fondo.codigo;
    this.backService.planes.getPlanes({
      'mimFondo.codigo': codigo, isPaged: false,
      'mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO],
      sort: 'nombre,asc', size: 1000000
    }).subscribe((respuesta: any) => {
      this.planes = respuesta ? respuesta.content : [];

      if (!this._esCreacion) {
        if (!this.planSelected(this.canalVentaMovimiento.mimPlanCanalVentaPK.codigoPlan)) {
          this.planes.push(this.canalVentaMovimiento.mimPlan);
        }
        this._initForm(this.canalVentaMovimiento);
      }

    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }
  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
