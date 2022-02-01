import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs/internal/Subscription';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { Observable } from 'rxjs/internal/Observable';

import { FormValidate } from '@shared/util';
import { OtrosParametrosService } from '../../services/otros-parametros.service';
import { AlertService } from '@core/services';
import { UrlRoute } from '@shared/static/urls/url-route';

@Component({
  selector: 'app-guardar-otros-parametros',
  templateUrl: './guardar-otros-parametros.component.html'
})
export class GuardarOtrosParametrosComponent extends FormValidate implements OnInit {

  form: FormGroup;

  isForm: Promise<any>;

  subscription: Subscription = new Subscription();

  codigoOtroParametro: any;

  otroParametro: any;

  constructor(private readonly otrosParametroService: OtrosParametrosService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly ngxUiLoaderService: NgxUiLoaderService) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoOtroParametro = params['codigo'];
      if (this.codigoOtroParametro) {
        this.otrosParametroService.getOtroParametro(this.codigoOtroParametro).subscribe((resp: any) => {
          this.otroParametro = resp;
          this._initForm(this.otroParametro);
        }, err => {
          this.alertService.warning(err.error.message);
        })
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        descripcion: new FormControl(param ? param.nombre : null),
        dias: new FormControl(param ? param.dias : null, [Validators.required]),
      }));
    this.form.controls.descripcion.disable();
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Ejecuta el proceso de actualizar
   */
  _alActualizar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });
      return;
    }
    this._actualizarOtroParametro();
  }

  _actualizarOtroParametro() {
    const form: any = this.form.value;
    const otroParametro = {
      codigo: this.otroParametro.codigo,
      nombre: this.otroParametro.nombre,
      dias: form.dias,
      estado: true
    };

    this.ngxUiLoaderService.start();
    this.otrosParametroService.putOtrosParametros(this.codigoOtroParametro, otroParametro).subscribe(() => {
      this.ngxUiLoaderService.stop();
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.alertService.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar otros parametros.
          this._irListaOtrosParametros();
        });
      });
    },
      (err: any) => {
        this.ngxUiLoaderService.stop();
        this.alertService.error(err.error.message);
      });
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Retorna a la pantalla de listar Otros parametros
   */
  _irListaOtrosParametros() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_OTROS_PARAMETROS]
    );
  }

  configurarMascara(): any{
    return {
      align: 'left',
      allowNegative: false,
      allowZero: true,
      decimal: ',',
      precision: 0,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: true,
      min: null,
      max: null,
      inputMode: CurrencyMaskInputMode.NATURAL
    };
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
  
}
