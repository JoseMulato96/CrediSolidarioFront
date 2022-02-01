import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { ProyectoVidaService } from '../../services/proyecto-vida.service';

@Component({
  selector: 'app-guardar-proyecto-vida',
  templateUrl: './guardar-proyecto-vida.component.html',
})
export class GuardarProyectoVidaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  proyectoVida: any;
  patterns = masksPatterns;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly proyectoVidaService: ProyectoVidaService,
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

  ngOnInit(): void {

    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo || null;
      if (this.codigo) {
        this.proyectoVidaService.getProyectoVida(this.codigo)
          .subscribe((resp: any) => {
            this.proyectoVida = resp;
            this._esCreacion = false;
            this._initForm(this.proyectoVida);
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
        nombre: new FormControl(param ? param.nombre : null, [Validators.required]),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1 ]')]),
        vigente: new FormControl(param ? param.vigente : true)
      }));

    if (!this._esCreacion) {

      this.form.controls.nombre.disable();
    }
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
      nombre: form.nombre,
      descripcion: form.descripcion,
      estado: true
    };

    this.ngxUiLoaderService.start();
    this.proyectoVidaService.postProyectoVida(param).subscribe((resp: any) => {
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
    const form: any = this.form.getRawValue();
    const param = {
      codigo: this.codigo,
      nombre: form.nombre,
      descripcion: form.descripcion,
      estado: this.proyectoVida.estado
    };
    this.proyectoVidaService.putProyectoVida(this.codigo, param).subscribe((resp: any) => {
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
      UrlRoute.ADMINISTRACION_COTIZADORES_PROYECTO_VIDA]);
  }

}
