import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-guardar-canales',
  templateUrl: './guardar-canales.component.html',
})
export class GuardarCanalesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  subscription: Subscription = new Subscription();
  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  codigo: string;


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }


  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;
    });
    if (this.codigo) {
      this.backService.canal.getCanalVenta(this.codigo).subscribe((resp: any) => {
        this._esCreacion = false;
        this._initForm(resp);
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
    } else {
      this._esCreacion = true;
      this._initForm();
    }
  }

  /**
 * Autor: Bayron Perez
 * Función: Inicializa el formulario
 */
  _initForm(param?: any) {

    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, CustomValidators.vacio]),
        nombreCorto: new FormControl(param ? param.nombreCorto : null, [Validators.required, CustomValidators.vacio]),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required, CustomValidators.vacio, Validators.maxLength(500)]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));
  }


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
      nombre: form.nombre,
      nombreCorto: form.nombreCorto,
      descripcion: form.descripcion,
      estado: form.vigente
    };

    this.backService.canal.postCanalVenta(param).subscribe((resp: any) => {
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
    const form: any = this.form.value;
    const param = {
      nombre: form.nombre,
      nombreCorto: form.nombreCorto,
      descripcion: form.descripcion,
      estado: form.vigente
    };
    this.backService.canal.putCanalVenta(this.codigo, param).subscribe((resp: any) => {
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

  _irListaListar() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_CANALES]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
