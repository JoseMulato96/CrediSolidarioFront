import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { entre, minMaxValidator } from '@shared/directives/min-max-validator.directive';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { AportesEstatutariosService } from '../../services/aportes-estatutarios.service';
import { TipoAporteService } from '../../services/tipo-aporte.service';
import { TipoVinculacionService } from '../../services/tipo-vinculacion.service';

@Component({
  selector: 'app-guardar-aportes-estatutarios',
  templateUrl: './guardar-aportes-estatutarios.component.html',
})
export class GuardarAportesEstatutariosComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  aporteEstatutario: any;
  patterns = masksPatterns;

  tiposVinculaciones: any[];
  tiposAportes: any[];

  errorBeetwenRangue: boolean;

  valorMaximoReset: boolean;
  valorMinimoReset: boolean;
  valorSugeridoReset: boolean;


  constructor(private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly aportesEstatutariosService: AportesEstatutariosService,
    private readonly tipoAporteService: TipoAporteService,
    private readonly tipoVinculacionService: TipoVinculacionService,
    private readonly translate: TranslateService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly ngxUiLoaderService: NgxUiLoaderService
  ) {
    super();
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {

    await this.obtenerDatosDesplegables();
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo || null;
      if (this.codigo) {
        this.aportesEstatutariosService.getAporteEstatutario(this.codigo)
          .subscribe((resp: any) => {
            this.aporteEstatutario = resp;
            this._esCreacion = false;
            this._initForm(this.aporteEstatutario);
          }, (err) => {
            this.alertService.warning(err.error.message);
          });
      } else {
        this._esCreacion = true;
        this._initForm();
      }
    });

  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoVinculacion: new FormControl(param ? this.obtenertipoVinculacion(param.mimTipoVinculacion.codigo) : null),
        tipoAporte: new FormControl(param ? this.obtenertipoAporte(param.mimTipoAporte.codigo) : null),
        valorSugerido: new FormControl(param ? param.valorSugerido : null, [Validators.required, Validators.min(0), Validators.max(999999999999)]),
        valorMinimo: new FormControl(param ? param.valorMinimo : null, [Validators.required, Validators.min(0), Validators.max(999999999999)]),
        valorMaximo: new FormControl(param ? param.valorMaximo : null, [Validators.required, Validators.min(0), Validators.max(999999999999)]),
        vigente: new FormControl(param ? param.estado : false)
      }, {
        validators: [
          minMaxValidator('valorMinimo', 'valorMaximo'),
          entre('valorMinimo', 'valorMaximo', 'valorSugerido')
        ]
      }));

    if (this._esCreacion) {
      this.form.controls.valorSugerido.setValue(0);
      this.form.controls.valorMinimo.setValue(0);
      this.form.controls.valorMaximo.setValue(0);
      this.form.controls.vigente.setValue(true);
      this.form.controls.vigente.disable();
    }


    if (!this._esCreacion) {
      this.form.controls.tipoVinculacion.disable();
      this.form.controls.tipoAporte.disable();
    }
    this.obtenerDatosDesplegables();
    this.valorSugeridoChange();
    this.valorMinimoChange();
    this.valorMaximoChange();
  }

  async obtenerDatosDesplegables() {
    const _tipoVinculacionItems = await this.tipoVinculacionService.obtenerTiposVinculacion({
      'estado': true,
      sort: 'descripcion,asc'
    }).toPromise().catch(err => this.alertService.error(err.error.message));
    this.tiposVinculaciones = _tipoVinculacionItems._embedded.mimTipoVinculacion;

    const _tipoAporteItems = await this.tipoAporteService.obtenerTiposAporte({
      'estado': true,
      sort: 'descripcion,asc'
    }).toPromise().catch(err => this.alertService.error(err.error.message));
    this.tiposAportes = _tipoAporteItems._embedded.mimTipoAporte;

  }

  valorSugeridoChange() {
    this.form.controls.valorSugerido.valueChanges.subscribe(item => {
      if (item == null) {
        this.form.controls.valorSugerido.setValue(0);
        this.valorSugeridoReset = true;
      }
      else {
        if (this.valorSugeridoReset) {
          this.valorSugeridoReset = false;
          this.form.controls.valorSugerido.setValue(item)
        }
      }
    })
  }

  valorMinimoChange() {
    this.form.controls.valorMinimo.valueChanges.subscribe(item => {
      if (item == null) {
        this.form.controls.valorMinimo.setValue(0);
        this.valorMinimoReset = true;
      }
      else {
        if (this.valorMinimoReset) {
          this.valorMinimoReset = false;
          this.form.controls.valorMinimo.setValue(item)
        }
      }
    })
  }

  valorMaximoChange() {
    this.form.controls.valorMaximo.valueChanges.subscribe(item => {
      if (item == null) {
        this.form.controls.valorMaximo.setValue(0);
        this.valorMaximoReset = true;
      }
      else {
        if (this.valorMaximoReset) {
          this.valorMaximoReset = false;
          this.form.controls.valorMaximo.setValue(item)
        }
      }
    })
  }

  private obtenertipoVinculacion(codigo: number) {
    return this.tiposVinculaciones ? this.tiposVinculaciones.find(item => item.codigo === codigo) : null;
  }

  private obtenertipoAporte(codigo: number) {
    return this.tiposAportes ? this.tiposAportes.find(item => item.codigo === codigo) : null;
  }

  _alGuardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.alertService.warning(validateForm);
      });
      return;
    }
    if (this._esCreacion) {
      this._crear();
    } else {
      this._actualizar();
    }
  }

  _crear() {
    const form: any = this.form.value;
    const param = {
      mimTipoVinculacion: { codigo: form.tipoVinculacion.codigo },
      mimTipoAporte: { codigo: form.tipoAporte.codigo },
      valorSugerido: form.valorSugerido,
      valorMinimo: form.valorMinimo,
      valorMaximo: form.valorMaximo,
      estado: true
    };

    this.ngxUiLoaderService.start();
    this.aportesEstatutariosService.postAporteEstatutario(param).subscribe((resp: any) => {
      this.ngxUiLoaderService.stop();

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.alertService.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.ngxUiLoaderService.stop();
      this.alertService.error(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.value;
    const param = {
      codigo: this.aporteEstatutario.codigo,
      mimTipoVinculacion: { codigo: this.aporteEstatutario.mimTipoVinculacion.codigo },
      mimTipoAporte: { codigo: this.aporteEstatutario.mimTipoAporte.codigo },
      valorSugerido: form.valorSugerido,
      valorMinimo: form.valorMinimo,
      valorMaximo: form.valorMaximo,
      estado: this.form.controls.vigente.value,
    };
    this.aportesEstatutariosService.putAporteEstatutario(this.codigo, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.alertService.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.alertService.error(err.error.message);
    });
  }

  _irListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_APORTES_ESTATUTARIOS]);
  }

}
