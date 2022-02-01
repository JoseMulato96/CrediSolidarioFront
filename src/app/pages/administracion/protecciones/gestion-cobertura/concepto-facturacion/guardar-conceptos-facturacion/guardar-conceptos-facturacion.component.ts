import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidate, CustomValidators } from '@shared/util';
import { Subscription, Observable } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-conceptos-facturacion',
  templateUrl: './guardar-conceptos-facturacion.component.html',
})
export class GuardarConceptosFacturacionComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  patterns = masksPatterns;
  validateForm: any;
  isPristine: any;

  conceptoFacturacionItem: any[] = [];
  listaConceptos: any[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService

  ) {
    super();
   }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;

      if (this.codigo) {
        this.backService.conceptoFacturacion.getConceptoFacturacion(this.codigo)
          .subscribe((resp: any) => {
            this.conceptoFacturacionItem = resp;
            this._esCreacion = false;
            this._initForm(resp);
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          });
      } else {
        this._esCreacion = true;
        this._initForm();
      }
    });
  }

  /**
   * Autor: Bayron Perez
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {

    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        concepto: new FormControl(param ? param.concepto : null, [Validators.required, Validators.maxLength(20), CustomValidators.vacio]),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required, Validators.maxLength(256), CustomValidators.vacio]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

      if (this._esCreacion) {
        this.form.controls.vigente.setValue(true);
        this.form.controls.vigente.disable();
      }
      if (!this._esCreacion) {
        this.form.controls.concepto.disable();
        this.validarEstadoConceptofacturacion(param);
      }
  }

  async validarEstadoConceptofacturacion(param: any) {
    const _listaConceptos = await this.backService.conceptoFacturacionPlanCobertura.getConceptosFacturacion({
      'sipConceptoFacturacion.concepto': param.concepto,
    }).toPromise();
    this.listaConceptos = _listaConceptos.content;
    if (this.listaConceptos.length > 0 && this.listaConceptos != null) {
      this.form.controls.vigente.disable();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Autor: Bayron Andres
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
   * Autor: Bayron Andres Perez Muñoz
   * Función: Crea un Enfermedad Grave
   */
  _crear() {
    const form: any = this.form.value;
    const param = {
      concepto: form.concepto,
      descripcion: form.descripcion,
      estado: true,
    };

    this.backService.conceptoFacturacion.postConceptoFacturacion(param).subscribe((resp: any) => {
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
   * Autor: Bayron Andres Perez
   * Función: Modifica la información del fondo
   */
  _actualizar() {
    const param = {
      concepto: this.form.controls.concepto.value,
      descripcion: this.form.controls.descripcion.value,
      estado: this. form.controls.vigente.value,
    };
    this.backService.conceptoFacturacion.putConceptoFacturacion(this.codigo, param).subscribe((resp: any) => {
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
   * Autor: Bayron Andres Perez M
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA, UrlRoute.ADMINISTRACION_PROTECCIONES_CONCEPTOS_FACTURACION]);
  }



  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }


}
