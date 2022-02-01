import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { UrlRoute } from '@shared/static/urls/url-route';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { minMaxValidator} from '@shared/directives/min-max-validator.directive';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-porcentaje-cuotas',
  templateUrl: './guardar-porcentaje-cuotas.component.html',
})
export class GuardarPorcentajeCuotasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoPorcentajeCuotas: any;
  porcentajeCuota: any;

  categorias: any[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
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
      this.codigoPorcentajeCuotas = params.codigo || null;

      forkJoin({
        _porcentajeCuotas: this.backService.porcentajeCuotas.getPorcentajeCuotas({}),
        _categorias: this.backService.categoriasAsociado.getCategoriasAsociado({ estado: MIM_PARAMETROS.SIP_CATEGORIA_ASOCIADO.ACTIVO })
      }).subscribe((items: any) => {
        this.categorias = [];
        items._categorias.content.map(x => {
          if (!items._porcentajeCuotas.content.find(t => t.sipCategoriaAsociado.codigo === x.codigo)) {
            this.categorias.push(x);
          }
        });

        if (this.codigoPorcentajeCuotas) {
          this.backService.porcentajeCuotas.getPorcentajeCuota(this.codigoPorcentajeCuotas)
            .subscribe((resp: any) => {
              this.porcentajeCuota = resp;
              if (!this.categoriaSelected(this.porcentajeCuota.sipCategoriaAsociado.codigo)) {
                this.categorias.push(this.porcentajeCuota.sipCategoriaAsociado);
              }
              this._esCreacion = false;
              this._initForm(this.porcentajeCuota);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irListar();
      });

    });
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        categoria: new FormControl(param ? this.categoriaSelected(param.sipCategoriaAsociado.codigo) : null, [Validators.required]),
        valorMinimo: new FormControl(param ? param.porcentajeMinimo : null, [Validators.required, Validators.max(100), Validators.min(1)]),
        valorMaximo: new FormControl(param ? param.porcentajeMaximo : null, [Validators.required, Validators.max(100), Validators.min(1)]),
        vigente: new FormControl(param ? param.estado : true)
      }, {
        validators: [
          minMaxValidator('valorMinimo', 'valorMaximo' )
        ]
      }));

    if (!this._esCreacion) {
      this.form.controls.categoria.disable();
    }
  }

  categoriaSelected(codigo: string) {
    return this.categorias.find(item => item.codigo === codigo);
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

  _crear() {
    const form: any = this.form.value;
    const param = {
      sipCategoriaAsociado: { codigo: form.categoria.codigo },
      porcentajeMinimo: form.valorMinimo,
      porcentajeMaximo: form.valorMaximo,
      estado: true
    };

    this.backService.porcentajeCuotas.postPorcentajeCuota(param).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      codigo: this.codigoPorcentajeCuotas,
      sipCategoriaAsociado: { codigo: form.categoria.codigo },
      porcentajeMinimo: form.valorMinimo,
      porcentajeMaximo: form.valorMaximo,
      estado: form.vigente
    };
    this.backService.porcentajeCuotas.putPorcentajeCuota(this.codigoPorcentajeCuotas, param).subscribe((resp: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_COTIZADORES,
      UrlRoute.ADMINISTRACION_COTIZADORES_PORCENTAJE_CUOTA]);
  }

}
