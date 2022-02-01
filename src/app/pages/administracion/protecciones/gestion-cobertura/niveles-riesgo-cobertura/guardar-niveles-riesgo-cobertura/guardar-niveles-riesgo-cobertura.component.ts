import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { Observable } from 'rxjs/internal/Observable';
import { TranslateService } from '@ngx-translate/core';
import { DateUtil } from '@shared/util/date.util';
import { FormComponent } from '@core/guards';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { BackFacadeService, FrontFacadeService } from '@core/services';

@Component({
  selector: 'app-guardar-niveles-riesgo-cobertura',
  templateUrl: './guardar-niveles-riesgo-cobertura.component.html',
})
export class GuardarNivelesRiesgoCoberturaComponent extends FormValidate implements OnInit, FormComponent {

  _esCreacion: boolean;
  vigenciaFechasAMantenerSeleccionadas: Date[];
  form: FormGroup;
  isForm: Promise<any>;
  fondos: any[] = [];
  nivelesRiesgos: any[] = [];
  coberturas: any[] = [];
  nivelRiesgos: any[] = [];

  _codigosNivelCoberturaSubscription: Subscription;
  codigoCobertura: any;
  codigoNivelRiesgo: any;
  estadoNivelRiesgo: any;
  nivelRiesgoCobertura: any;
  data: any[];
  nivelRiesgo: any;
  estadoFecha: boolean;

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
    this._codigosNivelCoberturaSubscription = this.activatedRoute.params.subscribe((params: any) => {
      this.codigoCobertura = params.codigoNivelRiesgo;
      this.codigoNivelRiesgo = params.codigoCobertura;

      forkJoin([
        this.backService.fondo.getFondos({ estado: true, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }),
        this.backService.nivelRiesgoCobertura.getRiesgoCobeturas({ estado: true, isPaged: true, sort: 'mimCobertura.nombre,asc', 'size': 1000000 }),
        this.backService.nivelRiesgo.getNivelesRiesgos({ estado: true })
      ]).subscribe(([
        _listaFondos,
        _listaNivelRiesgo,
        _nivelRiesgos
      ]) => {
        this.fondos = _listaFondos.content;
        this.nivelesRiesgos = _listaNivelRiesgo.content.map(x => x.mimNivelRiesgo);
        this.nivelRiesgos = _nivelRiesgos._embedded.mimNivelRiesgo;
        if (this.codigoCobertura && this.codigoNivelRiesgo) {
          this.backService.nivelRiesgoCobertura.getRiesgoCobetura(this.codigoNivelRiesgo, this.codigoCobertura)
            .subscribe((resp: any) => {
              this.nivelRiesgoCobertura = resp;
              this._setRowInactivo(resp);
              this._esCreacion = false;
              this.obtenerCoberturasPorFondo(resp.mimCobertura.mimFondo.codigo);
            }, (err) => {
              this.frontService.alert.warning(err.error.message);
            });
        } else {
          this._esCreacion = true;
          this._initForm();
        }
      }, (err: any) => {
        this.frontService.alert.warning(err.error.message);
        this._irListaItems();
      });
    });
  }

  _setRowInactivo(row: any) {
    if (!this.fondoSelected(row.mimCobertura.mimFondo.codigo)) {
      this.fondos.push(row.mimCobertura.mimFondo);
    }

    if (!this.nivelesRiesgosSelected(row.mimNivelRiesgo.codigo)) {
      this.nivelRiesgos.push(row.mimNivelRiesgo);
    }

  }

  _initForm(params?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fondo: new FormControl(params ? this.fondoSelected(params.mimCobertura.mimFondo.codigo) : null, [Validators.required]),
        cobertura: new FormControl(params ? this.coberturaSelected(params.mimCobertura.codigo) : null, [Validators.required]),
        nivelesRiesgos: new FormControl(params ? this.nivelesRiesgosSelected(params.mimNivelRiesgo.codigo) : null, [Validators.required]),
        fechaInicioFechaFin: new FormControl(params ? this.rangoFechaSelected(params.fechaInicio, params.fechaFin) : null, [Validators.required])
      }));

    this.estadoNivelRiesgo = params ? params.estado : true;

    if (!this._esCreacion) {
      this.form.controls.fondo.disable();
      this.form.controls.cobertura.disable();
      this.form.controls.nivelesRiesgos.disable();

      this.vigenciaFechasAMantenerSeleccionadas = [DateUtil.stringToDate(params ? params.fechaInicio : null)];
      this.estadoFecha = params && !params.estado;
      if (params && !params.estado) {
        this.form.disable();
      }
    }
  }

  /**
   * Autor: Cesar Millan
   * Función: Retorna a la pantalla de listar
   */
  _irListaItems() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_COBERTURA_NIVELES_RIESGO_COBERTURA
    ]);
  }

  _changeFondo() {
    const codigo = this.form.value.fondo.codigo;
    this.backService.cobertura.obtenerCoberturas({
      'mimFondo.codigo': codigo,
      'mimEstadoCobertura.codigo': MIM_PARAMETROS.MIM_ESTADO_COBERTURA.ACTIVO,
      isPaged: true, sort: 'nombre,asc', 'size': 1000000
    }).subscribe((resp: any) => {
      this.coberturas = resp.content;
      if (!this._esCreacion && !this.coberturaSelected(this.nivelRiesgoCobertura.mimCobertura.codigo)) {
        this.coberturas.push(this.nivelRiesgoCobertura.mimNivelRiesgo);
      }
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });

  }

  _alGuardar() {
    if (this.validaForm()) {
      return;
    }
    if (this._esCreacion) {
      this._crearCategoriaAsociado();
    } else {
      this._actualizarCliente();
    }
  }

  _crearCategoriaAsociado() {
    const form: any = this.form.value;
    const fechaInicio = DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy');
    const fechaFin = form.fechaInicioFechaFin[1] !== null ? DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy') : null;

    const categoriaAsociado = {
      mimNivelRiesgo: { codigo: form.nivelesRiesgos.codigo },
      mimCobertura: { codigo: form.cobertura.codigo },
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estado: this.estadoNivelRiesgo
    };

    this.backService.nivelRiesgoCobertura.postRiesgoCobetura(categoriaAsociado).subscribe((_categoriaAsociado: any) => {
      this.translate.get('global.guardadoExitosoMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text).then(() => {
          this.form.reset();
          this._initForm();
          // Redireccionamos a la pantalla de listar.
          this._irListaItems();
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _actualizarCliente() {
    const form: any = this.form.getRawValue();
    const categoriaAsociado = {
      mimNivelRiesgo: { codigo: form.nivelesRiesgos.codigo },
      mimCobertura: { codigo: form.cobertura.codigo },
      fechaInicio: DateUtil.dateToString(form.fechaInicioFechaFin[0], 'dd-MM-yyyy'),
      fechaFin: DateUtil.dateToString(form.fechaInicioFechaFin[1], 'dd-MM-yyyy'),
      estado: this.estadoNivelRiesgo
    };

    this.backService.nivelRiesgoCobertura.putRiesgoCobetura(this.codigoNivelRiesgo, this.codigoCobertura, categoriaAsociado)
      .subscribe((_resp: any) => {

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text).then(() => {
            this.form.reset();
            this._initForm();
            // Redireccionamos a la pantalla de listar.
            this._irListaItems();
          });
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  private validaForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return true;
    }
    return false;
  }

  fondoSelected(codigo) {
    return this.fondos.find(x => x.codigo === codigo);
  }

  coberturaSelected(codigo) {
    return this.coberturas.find(x => x.codigo === codigo);
  }

  nivelesRiesgosSelected(codigo) {
    return this.nivelRiesgos.find(x => x.codigo === codigo);
  }

  obtenerCoberturasPorFondo(codigoFondo: string) {
    this.backService.cobertura.obtenerCoberturas({ 'mimFondo.codigo': codigoFondo, isPaged: true, sort: 'nombre,asc', 'size': 1000000 }).subscribe((resp: any) => {
      this.coberturas = resp.content;
      this._initForm(this.nivelRiesgoCobertura);
    }, (err) => {
      this.frontService.alert.warning(err.error.message);
    });
  }

  rangoFechaSelected(fechaIni: any, fechaFin: any) {
    return [DateUtil.stringToDate(fechaIni), DateUtil.stringToDate(fechaFin)];
  }
  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
