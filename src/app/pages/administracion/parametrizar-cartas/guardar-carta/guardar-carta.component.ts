import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription, Observable } from 'rxjs';
import { FormValidate } from '@shared/util';
import { FormComponent } from '@core/guards';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-guardar-carta',
  templateUrl: './guardar-carta.component.html',
  styleUrls: ['./guardar-carta.component.css']
})

export class GuardarCartaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  config: any = {
    verify_html : false, // Esta opción hace que no se verifique el código html, se activa porque el componente estaba quitando las etiquetas de thymeleaf
    height: 320,
    theme: 'silver',
    plugins: 'codemirror preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
    toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | code',
    image_advtab: true,
    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions ',
    codemirror: {
      indentOnInit: true, // Whether or not to indent code on init.
      width: 1400,         // Default value is 800
      height: 700,        // Default value is 550
      path: 'codemirror', // Path to CodeMirror distribution
      jsFiles: [          // Additional JS files to load
       'mode/clike/clike.js',
       'mode/php/php.js'
      ]
    }
  };

  codigoCarta: any;
  _codigoCartaSubscription: Subscription;
  carta: any;
  _esCreacion: boolean;

  form: FormGroup;
  isForm: Promise<any>;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {

    this._codigoCartaSubscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCarta = params['codigo'];

      if (this.codigoCarta) {
        this.backService.parametroCarta.obtenerCarta(this.codigoCarta)
          .subscribe((resp: any) => {
            this.carta = resp;
            this._esCreacion = false;
            this._initForm(this.carta);
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          });
      } else {
        this._esCreacion = true;
        this._initForm();
      }

    });

  }

  ngOnDestroy() {
    if (this._codigoCartaSubscription) {
      this._codigoCartaSubscription.unsubscribe();
    }
  }

  _initForm(carta?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        nombreCarta: new FormControl(carta ? carta.nombre : null, [Validators.required]),
        contenidoCarta: new FormControl(carta ? carta.base64Contenido : null, [Validators.required]),
        vigente: new FormControl(carta ? carta.estado : false, [Validators.required])
      }));
  }

  _alGuardarCarta() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._esCreacion) {
      this._crearCarta();
    } else {
      this._actualizarCarta();
    }
  }

  _actualizarCarta() {

    this.carta.nombre = this.form.controls.nombreCarta.value;
    this.carta.base64Contenido = this.form.controls.contenidoCarta.value;
    this.carta.estado = this.form.controls.vigente.value;

    this.backService.parametroCarta.actualizarCarta(this.codigoCarta, this.carta).subscribe((_carta: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar cartas.
          this._irACartas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _crearCarta() {
    const carta = {
      nombre: this.form.controls.nombreCarta.value,
      base64Contenido: this.form.controls.contenidoCarta.value,
      estado: true
    };
    this.backService.parametroCarta.guardarCarta(carta).subscribe((_carta: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar cartas.
          this._irACartas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _irACartas() {
    this.router.navigate([UrlRoute.PAGES, UrlRoute.ADMINISTRACION, UrlRoute.ADMINISTRACION_PARAMETRIZAR_CARTAS]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
