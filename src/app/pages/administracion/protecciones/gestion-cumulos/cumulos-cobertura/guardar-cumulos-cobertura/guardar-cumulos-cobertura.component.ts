import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-guardar-cumulos-cobertura',
  templateUrl: './guardar-cumulos-cobertura.component.html',
})
export class GuardarCumulosCoberturaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigoCumulo: any;
  codigoCobertura: any;
  codigoFondo: any;
  cumulo: any;
  fondo: any;
  plan: any;
  cobertura: any;
  tipoPlan: any;
  cumuloPlanCobertura: any;

  cumulos: any[] = [];
  fondos: any[] = [];
  coberturas: any[] = [];
  tipoPlanes: any[] = [];
  planesCobertura: any[] = [];

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
      this.codigoCumulo = params['codigoCumulo'];
      this.codigoCobertura = params['codigoCobertura'];
      this.codigoFondo = params['codigoFondo'];

      if (this.codigoCumulo && this.codigoCobertura) {
        this._esCreacion = false;
        this.consultarPlanesCoberturaFondo(this.codigoFondo);
      }
      // Nos aseguramos de cargar los parametros antes de inicializar el formulario.
      forkJoin([
        this.backService.fondo.getFondos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 }),
        this.backService.cumulo.getCumulos({ estado: true, sort: 'nombre,asc', isPaged: true, size: 1000000 })
      ]).subscribe(([
        _fondos,
        _cumulos
      ]) => {
        this.cumulos = _cumulos.content;
        this.fondos = _fondos.content;
        if (this.codigoCumulo && this.codigoCobertura) {
          this.backService.cumuloCobertura.getCumuloCobertura(this.codigoCumulo, this.codigoCobertura)
            .subscribe((resp: any) => {
              this.cumuloPlanCobertura = resp;
              this._setRowInactivo(resp);
              this._initForm(this.cumuloPlanCobertura);
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


  _setRowInactivo(resp: any) {
    if (!this.fondoSelected(resp.mimPlanCobertura.mimCobertura.mimFondo.codigo)) {
      this.fondos.push(resp.mimCobertura.mimFondo);
    }
    if (!this.cumuloSelected(resp.mimCumulo.codigo)) {
      this.cumulos.push(resp.mimCumulo);
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   * @param param
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimPlanCobertura.mimCobertura.mimFondo.codigo) : null, [Validators.required]),
        planCobertura: new FormControl(param ? this.coberturaSelected(param.mimPlanCoberturaList) : null, [Validators.required]),
        nombreCumulo: new FormControl(param ? this.cumuloSelected(param.mimCumulo.codigo) : null, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.nombreCumulo.disable();
      this.form.controls.fondo.disable();
      if (param && !param.estado) {
        this.form.disable();
      }
    }
    this._change();
  }

  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
  }


  coberturaSelected(items: any) {
    return this.planesCobertura.filter(planCobertura => items.find(item => item === planCobertura.codigo));
  }

  cumuloSelected(codigo: string) {
    return this.cumulos.find(x => x.codigo === codigo);
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
   * Función: Crea un fondo
   */
  _crear() {
    const form: any = this.form.value;
    const param = {

      mimFondo: {
        codigo: form.fondo.codigo
      },
      mimCumulo: {
        codigo: form.nombreCumulo.codigo
      },
      mimPlanCoberturaList: form.planCobertura.map((planCobertura: any) => planCobertura.codigo),
      estado: true
    };

    this.backService.cumuloCobertura.postCumuloCobertura(param).subscribe((resp: any) => {
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
    const form: any = this.form.getRawValue();
    const param = {
      mimFondo: {
        codigo: form.fondo.codigo
      },
      mimCumulo: {
        codigo: form.nombreCumulo.codigo
      },
      mimCobertura: {
        codigo: form.planCobertura.codigo
      },

      mimPlanCoberturaList: form.planCobertura.map((planCobertura: any) => planCobertura.codigo),

      estado: this.cumuloPlanCobertura.estado
    };

    this.backService.cumuloCobertura.putCumuloCobertura(this.codigoCumulo, this.codigoCobertura, param).subscribe((resp: any) => {
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
   * Función: Retorna a la pantalla de listar los fondos
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_CUMULOS,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CUMULOS_COBERTURA
    ]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Encargada de registrar los cambios en el formulario
   */
  _change(){
    this.form.controls.fondo.valueChanges.subscribe(item => {
      if(item){
        this.consultarPlanesCoberturaFondo(item.codigo);
      }
    });
  }

  private consultarPlanesCoberturaFondo(item: any){
    this.backService.planCobertura.getPlanCoberturaFondo(item).subscribe(
      respuesta => {
        this.planesCobertura = respuesta.content.map((plan:any) => ({ ...plan, _nombre: `${plan.mimPlan.nombre} - ${plan.nombre}` }));
      });
  }

}
