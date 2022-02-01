import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { CustomValidators, FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-guardar-desmembracion-por-accidente',
  templateUrl: './guardar-desmembracion-por-accidente.component.html',
})
export class GuardarDesmembracionPorAccidenteComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  fondo: any;
  exclusionItem: any;

  fondos: any[] = [];
  desmembracionAccidentalItems: any[] = [];
  patterns = masksPatterns;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { super(); }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo;

      this.backService.fondo.getFondos({
        estado: true,
        isPaged: true, sort:
        'nombre,asc', 'size': 1000000 }).subscribe(fondos => {
        this.fondos = fondos.content;
        if (this.codigo) {
          this.backService.desmembracionAccidente.getDesmembracionPorAccidental(this.codigo)
            .subscribe((resp: any) => {
              this.exclusionItem = resp;
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
   * Autor: Cesar Millan
   * Función: Inicializa el formulario
   */
  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(param ? this.fondoSelected(param.mimFondo.codigo) : null, [Validators.required]),
        desmembracionAccidental: new FormControl(param ? param.descripcion : null, [Validators.required, Validators.maxLength(256), CustomValidators.vacio, Validators.pattern('.*\\S.*[a-zA-z0-9-zÀ-ÿ\u00f1\u00d1\,\. ]')]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required])
      }));

    if (!this._esCreacion) {
      this.form.controls.fondo.disable();
    }
  }

  /**
   * Autor: Cesar Millan
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
      mimFondo: { codigo: form.fondo.codigo },
      descripcion: form.desmembracionAccidental,
      estado: true,
    };
    this.backService.desmembracionAccidente.postDesmembracionPorAccidente(param).subscribe((resp: any) => {
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
      ...this.exclusionItem,
      descripcion: form.desmembracionAccidental,
      estado: form.vigente,
    };
    this.backService.desmembracionAccidente.putDesmembracionPorAccidente(this.codigo, param).subscribe((resp: any) => {
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
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar de las frecuencias facturación
   */
  _irListaListar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_DESMEMBRACION_ACCIDENTE
    ]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
