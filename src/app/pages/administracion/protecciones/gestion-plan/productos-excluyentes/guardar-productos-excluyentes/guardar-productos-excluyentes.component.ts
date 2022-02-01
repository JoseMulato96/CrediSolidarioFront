import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { ProductosExcluyentesService } from '../services/productos-excluyentes.service';

@Component({
  selector: 'app-guardar-productos-excluyentes',
  templateUrl: './guardar-productos-excluyentes.component.html',
})
export class GuardarProductosExcluyentesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  subscription: Subscription = new Subscription();
  codigoProductoExcluyente: any;
  productoExcluyente: any;

  tipoSolicitudes: any[];
  fondos1: any[];
  fondos2: any[];
  fondosAll: any[];
  planes1: any[];
  planes2: any[];
  plane1All: any[];
  plane2All: any[];
  estadoFecha: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly productosExcluyentesService: ProductosExcluyentesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoProductoExcluyente = params['codigo'];

      forkJoin({
        _tipoSolicitud: this.backService.tiposMovimientos.getTiposMovimientos({
          sort: 'nombre,asc', isPaged: true, size: 1000000,
          codigo: [GENERALES.TIPO_MOVIMIENTO.INCREMENTAR, GENERALES.TIPO_MOVIMIENTO.VINCULACION],
        }),
        _fondos: this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 })
      }).subscribe((items: any) => {
        this.tipoSolicitudes = items._tipoSolicitud._embedded.mimTipoMovimiento;
        const _fondo = [{ codigo: null, nombre: 'Seleccionar' }, ...items._fondos.content];
        this.fondos1 = _fondo;
        this.fondos2 = _fondo;
        this.fondosAll = _fondo;
        if (this.codigoProductoExcluyente) {
          this.productosExcluyentesService.getProductoExcluyente(this.codigoProductoExcluyente)
            .subscribe(async (resp: any) => {
              this.productoExcluyente = resp;
              this.planes1 = await this.getPlanes(resp.mimPlan1.mimFondo.codigo);
              this.planes2 = await this.getPlanes(resp.mimPlan2.mimFondo.codigo);
              this.setRowInactivo(resp);
              this._esCreacion = false;
              this.initForm(this.productoExcluyente);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this.initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this.irListaPlanes();
      });

    });
  }

  setRowInactivo(row: any) {
    if (!this.tipoSolicitudSelected(row.mimTipoMovimiento.codigo)) {
      this.tipoSolicitudes.push(row.mimTipoMovimiento);
    }
    if (!this.plan1Selected(row.mimPlan1.codigo)) {
      this.planes1.push(row.mimPlan1);
    }
    if (!this.plan2Selected(row.mimPlan2.codigo)) {
      this.planes2.push(row.mimPlan2);
    }
    if (!this.fondo1Selected(row.mimPlan1.mimFondo.codigo)) {
      this.fondos1.push(row.mimPlan1.mimFondo.codigo);
    }
    if (!this.fondo2Selected(row.mimPlan2.mimFondo.codigo)) {
      this.fondos2.push(row.mimPlan2.mimFondo.codigo);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoSolicitud: [param ? this.tipoSolicitudSelected(param.mimTipoMovimiento.codigo) : null, [Validators.required]],
        fondo1: [param ? param.mimPlan1.mimFondo : null, [Validators.required]],
        fondo2: [param ? param.mimPlan2.mimFondo : null, [Validators.required]],
        plan1: [param ? param.mimPlan1 : null, [Validators.required]],
        plan2: [param ? param.mimPlan2 : null, [Validators.required]],
        fechaInicioFechaFin: [param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]],
        estado: [param ? param.estado : false],
      }));

    this.changeForm();

    if (!this._esCreacion) {
      this.form.controls.tipoSolicitud.disable();
      this.form.controls.fondo1.disable();
      this.form.controls.fondo2.disable();
      this.form.controls.plan1.disable();
      this.form.controls.plan2.disable();
    }
  }

  private changeForm() {
    this.form.controls.fondo1.valueChanges.subscribe(async item => {
      if (item && item.codigo) {
        this.fondos2 = this.fondosAll.filter(fondo => fondo.codigo !== item.codigo);
        this.planes1 = this._esCreacion ? await this.getPlanes(item.codigo) : this.planes1;
      } else {
        this.fondos2 = this.fondosAll;
        this.planes1 = null;
        this.form.controls.fondo1.setValue(null, { emitEvent: false });
      }
    });
    this.form.controls.fondo2.valueChanges.subscribe(async item => {
      if (item && item.codigo) {
        this.fondos1 = this.fondosAll.filter(fondo => fondo.codigo !== item.codigo);
        this.planes2 = this._esCreacion ? await this.getPlanes(item.codigo) : this.planes2;
      } else {
        this.fondos1 = this.fondosAll;
        this.planes2 = null;
        this.form.controls.fondo2.setValue(null, { emitEvent: false });
      }
    });
  }

  /**
   * Autor: Cesar Millan
   * @param codigo Código del tipo de plan
   */
  private tipoSolicitudSelected(codigo: string) {
    return this.tipoSolicitudes.find(x => x.codigo === codigo);
  }
  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del fondo 1
   */
  private fondo1Selected(codigo: string) {
    return this.fondos1.find(x => x.codigo === codigo);
  }
  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del fondo 2
   */
  private fondo2Selected(codigo: string) {
    return this.fondos2.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del plan 1
   */
  private plan1Selected(codigo: string) {
    return this.planes1.find(x => x.codigo === codigo);
  }

  /**
   * Autor: Cesar Millan
   * @param codigo Codigo del plan 2
   */
  private plan2Selected(codigo: string) {
    return this.planes2.find(x => x.codigo === codigo);
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
  alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this.crear();
    } else {
      this.actualizar();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un fondo
   */
  private crear() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0]);
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1]);

    const row = {
      mimTipoMovimiento: { codigo: form.tipoSolicitud.codigo },
      mimFondo1: { codigo: form.fondo1.codigo },
      mimPlan1: { codigo: form.plan1.codigo },
      mimFondo2: { codigo: form.fondo2.codigo },
      mimPlan2: { codigo: form.plan2.codigo },
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: true
    };

    this.productosExcluyentesService.postProductoExcluyente(row).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.initForm();
          // Redireccionamos a la pantalla de listar.
          this.irListaPlanes();
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
  private actualizar() {
    const form: any = this.form.getRawValue();
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0]);
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1]);

    const row = {
      codigo: this.codigoProductoExcluyente,
      mimTipoMovimiento: { codigo: form.tipoSolicitud.codigo },
      mimFondo1: { codigo: form.fondo1.codigo },
      mimPlan1: { codigo: form.plan1.codigo },
      mimFondo2: { codigo: form.fondo2.codigo },
      mimPlan2: { codigo: form.plan2.codigo },
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: form.estado
    };

    this.productosExcluyentesService.putProductoExcluyente(this.codigoProductoExcluyente, row).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this._esCreacion = true;
          this.initForm();
          // Redireccionamos a la pantalla de listar.
          this.irListaPlanes();
        });
      });
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar
   */
  irListaPlanes() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PRODUCTOS_EXCLUYENTES
    ]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  private async getPlanes(codigoFondo: any) {
    const _planes: any = await this.backService.planes.getPlanes({
      'mimFondo.codigo': codigoFondo,
      'mimEstadoPlan.codigo': MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO,
      sort: 'nombre,asc', isPaged: true, size: 1000000
    }).toPromise();
    return _planes ? _planes.content : [];
  }

}
