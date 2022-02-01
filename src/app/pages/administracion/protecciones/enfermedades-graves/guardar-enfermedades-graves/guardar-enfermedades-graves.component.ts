import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidate, CustomValidators } from '@shared/util';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import { Router, ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-enfermedades-graves',
  templateUrl: './guardar-enfermedades-graves.component.html',
})
export class GuardarEnfermedadesGravesComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  fondo: any;
   enfermedadItem: any;

  fondos: any[] = [];
  enfermedadesItems: any[] = [];
  patterns = masksPatterns;
  validateForm: any;
  isPristine: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
   }

  ngOnInit() {

    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;

      forkJoin([
        this.backService.fondo.getFondos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000  })
      ]).subscribe(([
        _fondos
      ]) => {
        this.fondos = _fondos['content'];
        if (this.codigo) {
          this.backService.enfermedadGrave.getEnfermedadGrave(this.codigo)
            .subscribe((resp: any) => {
              this.enfermedadItem = resp;
              if (!this.fondoSelected(resp.mimFondo.codigo)) {
                this.fondos.push(resp.mimFondo);
              }
              this._esCreacion = false;
              this._initForm(resp);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err) => {
        this.form.reset();
        this._initForm();
        this.frontService.alert.warning(err.error.message);
      });

    });
  }

  /**
   * Autor: Bayron Perez
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {

    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        codigo: new FormControl(param ? param.codigo : null),
        fondo: new FormControl(param ? this.fondoSelected(param.mimFondo.codigo) : null, [Validators.required]),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required, CustomValidators.vacio, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1\,\. ]')]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

      if (this._esCreacion) {
        this.form.controls.vigente.setValue(true);
        this.form.controls.vigente.disable();
      }
      if (!this._esCreacion) {
        this.form.controls.codigo.disable();
        this.form.controls.fondo.disable();
      }
  }

  /**
   * Autor: Bayron Andres
   * Función: Devuelve el item de datos del fondo
   * @param codigo Codigo del fondo
   */
  fondoSelected(codigo: string) {
    return this.fondos.find(x => x.codigo === codigo);
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
      mimFondo: { codigo: form.fondo.codigo },
      descripcion: form.descripcion,
      estado: true,
    };

    this.backService.enfermedadGrave.postEnfermedadGrave(param).subscribe((resp: any) => {
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
    const param = {
      codigo: this.form.controls.codigo.value,
      mimFondo: { codigo: this.form.controls.fondo.value.codigo },
      descripcion: this.form.controls.descripcion.value,
      estado: this. form.controls.vigente.value,
    };
    this.backService.enfermedadGrave.putEnfermedadGrave(this.codigo, param).subscribe((resp: any) => {
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
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINSTRACION_PROTECCIONES, UrlRoute.ADMINISTRACION_PROTECCIONES_ENFERMEDADES_GRAVES]);
  }



  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }


}
