import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subscription } from 'rxjs';
import { NotasAclaratoriasService } from '../../services/notas-aclaratorias.service';

@Component({
  selector: 'app-guardar-notas-aclaratorias',
  templateUrl: './guardar-notas-aclaratorias.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GuardarNotasAclaratoriasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  form: FormGroup;
  isForm: Promise<any>;

  _esCreacion = true;
  subscription: Subscription = new Subscription();
  codigo: string;
  notaAclaratoria: any;
  patterns = masksPatterns;
  text: string;
  tipoMovimientos: any;
  numeroCaracteres: number;
  /*
  * Si necesita agregar mas propiedades al editar, consultar la pagina quilljs
  */
  _modules = {
    toolbar: [
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ]
  };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router,
    private readonly ngxUiLoaderService: NgxUiLoaderService,
    private readonly notasClaratoriaService: NotasAclaratoriasService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigo = params.codigo || null;

      this.backService.tiposMovimientos.getTiposMovimientos({
        estado: true,
        codigo: [GENERALES.TIPO_MOVIMIENTO.COTIZACION, GENERALES.TIPO_MOVIMIENTO.DISMINUCION
          , GENERALES.TIPO_MOVIMIENTO.INCREMENTAR, GENERALES.TIPO_MOVIMIENTO.PAGO, GENERALES.TIPO_MOVIMIENTO.VINCULACION]
      }).subscribe(item => {
        this.tipoMovimientos = item._embedded.mimTipoMovimiento;

        if (this.codigo) {
          this.notasClaratoriaService.getNotaAclaratoria(this.codigo)
            .subscribe((resp: any) => {
              this.notaAclaratoria = resp;
              this._esCreacion = false;
              this._initForm(this.notaAclaratoria);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      });

    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  _initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoMovimiento: new FormControl(param ? this._tipoMovimientoSelected(param.mimTipoMovimiento.codigo) : null, [Validators.required]),
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(100)]),
        descripcion: new FormControl(param ? this._asignarDescripcion(param.descripcion) : null, [Validators.required, Validators.maxLength(4000)]),
      }));

    if (!this._esCreacion) {
      this.form.controls.tipoMovimiento.disable();
    }

    this.form.controls.descripcion.valueChanges.subscribe(() => {
      if (this.numeroCaracteres > 1000) {
        this.form.controls.descripcion.setErrors({ 'maxlength': true });
      }
      if (this.numeroCaracteres > 0 && this.numeroCaracteres <= 4000) {
        this.form.controls.descripcion.setErrors(null);
      }
    });
  }

  textChanged($event) {
    this.numeroCaracteres = $event.textValue.length;

    if ($event.textValue.length > 0 && $event.textValue.length <= 4000) {
      this.form.controls.descripcion.setErrors(null);
    }
  }

  _tipoMovimientoSelected(codigo: string) {
    return this.tipoMovimientos.find(item => item.codigo === codigo);
  }

  _asignarDescripcion(texto: any) {
    this.text = texto;
  }

  _alGuardar() {
    this.validarNombreYDescripcion();
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

  validarNombreYDescripcion() {
    const nombre = this.form.controls.nombre.value;
    const descripcion = this.form.controls.descripcion.value;
    if (nombre && nombre.trim().length === 0) {
      this.form.controls.nombre.setErrors({ required: true });
    } else {
      this.form.controls.nombre.setErrors(null);
    }
    let replaceAll = descripcion ? descripcion.replaceAll('<p>', '') : null;
    replaceAll = replaceAll ? replaceAll.replaceAll('</p>', '') : null;
    replaceAll = replaceAll ? replaceAll.replaceAll(' ', '') : null;
    if (replaceAll !== null) {
      if (replaceAll.trim().length === 0) {
        this.form.controls.descripcion.setErrors({ required: true });
      } else {
        this.form.controls.descripcion.setErrors(null);
      }
    }
  }

  _crear() {
    const form: any = this.form.value;
    const param = {
      mimTipoMovimiento: { codigo: form.tipoMovimiento.codigo },
      nombre: form.nombre,
      descripcion: this.text,
      estado: true
    };

    this.ngxUiLoaderService.start();
    this.notasClaratoriaService.postNotaAclaratoria(param).subscribe((resp: any) => {
      this.ngxUiLoaderService.stop();

      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListar();
        });
      });
    }, (err) => {
      this.ngxUiLoaderService.stop();
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizar() {
    const form: any = this.form.getRawValue();
    const param = {
      codigo: this.codigo,
      mimTipoMovimiento: { codigo: form.tipoMovimiento.codigo },
      nombre: form.nombre,
      descripcion: this.text,
      estado: this.notaAclaratoria.estado
    };
    this.notasClaratoriaService.putNotaAclaratoria(this.codigo, param).subscribe((resp: any) => {
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
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_COTIZADORES_GESTION_NOTAS,
      UrlRoute.ADMINISTRACION_COTIZADORES_NOTAS_ACLARATORIAS]);
  }

}
