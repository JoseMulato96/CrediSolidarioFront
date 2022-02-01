import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-beneficiario-pago',
  templateUrl: './guardar-beneficiario-pago.component.html',
})
export class GuardarBeneficiarioPagoComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  _esCreacion: boolean;
  form: FormGroup;
  isForm: Promise<any>;
  cobertura: any;
  listaTipoBeneficiarioPago: any[] = [];

  _codigosCoberturaPagosSubscription: Subscription;
  codigoCobertura: any;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    this._codigosCoberturaPagosSubscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCobertura = params['codigo'];

      forkJoin([
        this.backService.tipoBeneficiarioPago.obtenerTipoBeneficiarioPago({ estado: true, sort: 'nombre,asc', 'size': 1000000 })
      ]).subscribe(([
        _listaTipoBeneficiarioPago
      ]) => {
        this.listaTipoBeneficiarioPago = _listaTipoBeneficiarioPago._embedded.mimTipoBeneficiarioPago;

        if (this.listaTipoBeneficiarioPago) {
          this.backService.cobertura.obtenerCobertura(this.codigoCobertura)
            .subscribe((resp: any) => {
              this.cobertura = resp;
              this.backService.fondo.getFondo(this.cobertura.mimFondo.codigo).subscribe(mimFondo => {
                this.cobertura.mimFondo.nombre = mimFondo.nombre;
                this._setRowInactivo(resp);
                this._initForm(this.cobertura);
                this._esCreacion = false;
              }, (err) => {
                this.frontService.alert.warning(err.error.message);
              });
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message).then(() => {
          this._irListaItems();
        });
      });
    });
  }

  _setRowInactivo(resp: any) {
    resp.mimCoberturaBeneficiarioPagoList.forEach((row) => {
      if (row.mimTipoBeneficiarioPago && !row.mimTipoBeneficiarioPago.estado) {
        this.listaTipoBeneficiarioPago.push(row.mimTipoBeneficiarioPago);
      }
    });
  }

  _initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(params ? params.codigo : null, [Validators.required]),
        fondo: new FormControl(params ? params.mimFondo.nombre : null, [Validators.required]),
        nombre: new FormControl(params ? params.nombre : null, [Validators.required]),
        tipoBeneficiarioPago: new FormControl(params ? this.tipoBeneficiarioPagoSelected(params.mimCoberturaBeneficiarioPagoList) : null, [Validators.required]),
      }));


    if (!this._esCreacion) {
      this.form.controls.codigo.disable();
      this.form.controls.nombre.disable();
      this.form.controls.fondo.disable();
      if (params && params.mimEstadoCobertura.codigo === MIM_PARAMETROS.MIM_ESTADO_COBERTURA.INACTIVO) {
        this.form.disable();
      }
    }
  }

  tipoBeneficiarioPagoSelected(items: any[]) {
    return this.listaTipoBeneficiarioPago.filter(x => items.find(item =>
      item.mimCoberturaBeneficiarioPagoPK.codigoBeneficiarioPago === x.codigo));
  }

  _irListaItems() {
    this.router.navigate([UrlRoute.PAGES,
    UrlRoute.ADMINISTRACION,
    UrlRoute.ADMINSTRACION_PROTECCIONES,
    UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
    UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_BENEFICIARIO_PAGO]);
  }

  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (!this._esCreacion) {
      this._actualizar();
    }
  }

  _actualizar() {
    const form: any = {};

    const mimTipoBeneficiarioPago = [];
    this.form.controls.tipoBeneficiarioPago.value.forEach(x => {
      mimTipoBeneficiarioPago.push({
        mimCoberturaBeneficiarioPagoPK: { codigoBeneficiarioPago: x.codigo },
        mimTipoBeneficiarioPago: { codigo: x.codigo }
      });
    });

    form.mimCoberturaBeneficiarioPagoList = mimTipoBeneficiarioPago;

    this.backService.cobertura.actualizarMimBeneficarioCobertura(this.codigoCobertura, form)
      .subscribe((respuesta: any) => {
        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.form.reset();
            this._initForm();
            this._irListaItems();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  ngOnDestroy() {
    this._codigosCoberturaPagosSubscription.unsubscribe();
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
