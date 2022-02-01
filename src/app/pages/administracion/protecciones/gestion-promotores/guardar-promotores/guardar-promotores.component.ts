import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-guardar-promotores',
  templateUrl: './guardar-promotores.component.html',
})
export class GuardarPromotoresComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  numeroIdentificacionPromotor: any;
  promotor: any;

  canales: any[];
  listCanales: Observable<any>;
  tipoIdentificaciones: any[];
  tipoSolicitudes: any[];
  regionales: any[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.tipoIdentificaciones = [];
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.numeroIdentificacionPromotor = params['numeroIdentificacion'];

      forkJoin({
        tiposIdentificacion: this.backService.tipoIdentificacion.obtenerTipoIdentificaciones({ estado: true, sort: 'nombre,asc' }),
        tipoSolicitud: this.backService.tiposMovimientos.getTiposMovimientos({
          estado: true,
          codigo: [GENERALES.TIPO_MOVIMIENTO.DISMINUCION, GENERALES.TIPO_MOVIMIENTO.INCREMENTAR, GENERALES.TIPO_MOVIMIENTO.VINCULACION]
        }),
        regionales: this.backService.multiactiva.getUbicaciones(GENERALES.CODIGO_REGIONAL)
      }).subscribe(({ tiposIdentificacion, tipoSolicitud, regionales }) => {
        this.tipoIdentificaciones = tiposIdentificacion._embedded.mimTipoIdentificacion;
        this.tipoSolicitudes = tipoSolicitud._embedded.mimTipoMovimiento;
        this.regionales = regionales.filter(x => x.codInt !== 0);
        if (this.numeroIdentificacionPromotor) {
          this._esCreacion = false;
          this.backService.promotor.getPromotor(this.numeroIdentificacionPromotor)
            .subscribe(async (resp: any) => {
              this.promotor = resp;
              if(this.promotor && this.promotor.mimTipoMovimientoList && this.promotor.mimTipoMovimientoList.length > 0){
                this.getCanales(this.promotor.mimTipoMovimientoList.map(x => x.codigo));
              }
              this._initForm(this.promotor);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      });


    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   * @param param
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        compania: new FormControl(param ? param.compania : null, [Validators.required, CustomValidators.vacio]),
        tipoIdentificacion: new FormControl(param ? this.tipoIdentificacionSelected(param.mimTipoIdentificacion.codigo) : null, [Validators.required]),
        numeroIdentificacion: new FormControl(param ? param.numeroIdentificacion : null, [Validators.required]),
        nombrePromotor: new FormControl(param ? param.nombre : null, [Validators.required, CustomValidators.vacio]),
        correoElectronico: new FormControl(param ? param.correoElectronico : null, [Validators.required, Validators.email, CustomValidators.vacio]),
        regional: new FormControl(param && param.codigoRegional ? this.regionalSelected(param.codigoRegional) : null, [Validators.required]),
        tipoSolicitud: new FormControl(param && param.mimTipoMovimientoList ? this.tipoSolicitudesSelected(param.mimTipoMovimientoList) : null, [Validators.required]),
        canalVenta: new FormControl(param && param.mimCanalList ? this.subsCribeCanales(param.mimCanalList) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : true, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.tipoIdentificacion.disable();
      this.form.controls.numeroIdentificacion.disable();
      this.form.controls.correoElectronico.disable();
    }

    this.changesControls();
  }

  private changesControls() {
    this.form.controls.tipoSolicitud.valueChanges.subscribe(item => {
      if (!item) { return; }
      this.getCanales(item.map(x => x.codigo));
      this.subsCribeCanales();
    });
  }

  private getCanales(codigosTipoMovimiento: any) {
    this.listCanales = this.backService.movimientoPlanCanal.getMimMovimientoPlanCanal({
      mimTipoMovimiento: codigosTipoMovimiento,
      'mimPlanCanalVenta.mimCanalVenta.mimEstadoPlan.codigo': [MIM_PARAMETROS.MIM_ESTADO_PLAN.ACTIVO, MIM_PARAMETROS.MIM_ESTADO_PLAN.PROCESO]
    });
  }

  private subsCribeCanales(canalesSelected= []){
    this.listCanales.subscribe(resp => {
      const _canales = resp.content.map(x => x.mimPlanCanalVenta.mimCanalVenta);
      this.canales = [...new Set(_canales.map(JSON.stringify))].map((x: any) => JSON.parse(x));
      if(canalesSelected.length > 0){
        this.form.controls.canalVenta.setValue(this.canalesVentasSelected(canalesSelected));
      }
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Devuelve el item de datos del tipo de identificación
   * @param codigo Codigo del cliente
   */
  tipoIdentificacionSelected(codigo: string) {
    return this.tipoIdentificaciones.find(item => item.codigo === codigo);
  }

  regionalSelected(codigo: any) {
    return this.regionales.find(item => item.codInt === codigo);
  }
  tipoSolicitudesSelected(rows: any) {
    return this.tipoSolicitudes.filter(x => rows.find(t => t.codigo === x.codigo));
  }
  canalesVentasSelected(canales: any) {
    return this.canales && this.canales.length > 0 ? this.canales.filter(x => canales.find(t => t.codigo === x.codigo)): [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Cesar Millan
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o editar
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
      this._crearPromotor();
    } else {
      this._actualizarPromotor();
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Crea un promotor
   */
  _crearPromotor() {
    const form: any = this.form.value;
    const promotor = {
      compania: form.compania,
      numeroIdentificacion: form.numeroIdentificacion,
      nombre: form.nombrePromotor,
      correoElectronico: form.correoElectronico,
      mimTipoIdentificacion: { codigo: form.tipoIdentificacion.codigo },
      codigoRegional: form.regional.codInt,
      mimTipoMovimientoList: form.tipoSolicitud,
      mimCanalList: form.canalVenta,
      estado: form.vigente
    };

    this.backService.promotor.postPromotor(promotor).subscribe((resp: any) => {

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaPromotores();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Modifica la información del promotor
   */
  _actualizarPromotor() {
    const form: any = this.form.getRawValue();
    const promotor = {
      compania: form.compania,
      numeroIdentificacion: form.numeroIdentificacion,
      nombre: form.nombrePromotor,
      correoElectronico: form.correoElectronico,
      mimTipoIdentificacion: { codigo: form.tipoIdentificacion.codigo },
      codigoRegional: form.regional.codInt,
      mimTipoMovimientoList: form.tipoSolicitud,
      mimCanalList: form.canalVenta,
      estado: form.vigente
    };
    this.backService.promotor.putPromotor(this.numeroIdentificacionPromotor, promotor).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaPromotores();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar los fondos
   */
  _irListaPromotores() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_PROMOTORES]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
