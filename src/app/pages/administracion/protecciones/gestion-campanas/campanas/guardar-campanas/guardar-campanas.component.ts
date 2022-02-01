import { Component, OnInit } from '@angular/core';
import { CustomValidators, FormValidate } from '@shared/util';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { UrlRoute } from '@shared/static/urls/url-route';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-campanas',
  templateUrl: './guardar-campanas.component.html'
})
export class GuardarCampanasComponent extends FormValidate implements OnInit {

  form: FormGroup;

  isForm: Promise<any>;

  _esCreacion = true;

  subscription: Subscription = new Subscription();

  codigoCampana: any;

  campana: any;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCampana = params['codigo'];
      if (this.codigoCampana) {
        this.backService.campanaEndoso.getCampana(this.codigoCampana).subscribe( (resp: any) => {
          this.campana = resp;
          this._esCreacion = false;
          this._initForm(this.campana);
        }, err => {
          this.frontService.alert.warning(err.error.message);
        })
      } else {
        this._esCreacion = true;
        this._initForm();
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
        nombre: new FormControl(param ? param.nombre : null, [Validators.required, Validators.maxLength(100), CustomValidators.vacio]),
        descripcion: new FormControl(param ? param.descripcion : null, [Validators.required, Validators.maxLength(250), CustomValidators.vacio]),
        nombreBeneficiario: new FormControl(param ? param.nombreBeneficiario : null, [Validators.maxLength(100)]),
        fechaInicioFechaFin: new FormControl(param ? this.rangoFechaSelected(param.fechaInicio, param.fechaFin) : null, [Validators.required]),
        vigente: new FormControl(param ? param.estado : false, [Validators.required]),
      }));

    if (!this._esCreacion) {
      this.form.controls.codigo.disable();
    }
  }

  /**
   * Autor: Juan Cabuyales
   * Función: De acuerdo a la acción disparada ejecuta el proceso de crear o actualizar
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
      this._crearCampana();
    } else {
      this._actualizarCampana();
    }
  }

  _crearCampana() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    const campana = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      nombreBeneficiario: form.nombreBeneficiario,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: true
    };

    this.backService.campanaEndoso.postCampana(campana).subscribe((resp: any) => {
       this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar campanas.
          this._irListaCampanas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizarCampana() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy');
    const campana = {
      codigo: this.codigoCampana,
      nombre: form.nombre,
      descripcion: form.descripcion,
      nombreBeneficiario: form.nombreBeneficiario,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: form.vigente
    };

    this.backService.campanaEndoso.putCampana(this.codigoCampana , campana).subscribe((resp: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar campanas.
          this._irListaCampanas();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * Autor: Juan Cabuyales
   * Función: Retorna a la pantalla de listar las campañas
   */
  _irListaCampanas() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO,
      UrlRoute.ADMINISTRACION_PROTECCIONES_CAMPANAS_ENDOSO_CAMPANAS ]
    );
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }
}
