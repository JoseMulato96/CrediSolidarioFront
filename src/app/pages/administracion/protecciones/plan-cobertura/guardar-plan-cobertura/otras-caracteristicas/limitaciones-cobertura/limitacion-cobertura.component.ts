import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService, FrontFacadeService } from '@core/services';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Subscription } from 'rxjs';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { PostDatosPrincipalesAction, PostLimitacionCoberturaAction } from '../../../plan-cobertura.actions';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';

@Component({
  selector: 'app-limitacion-cobertura',
  templateUrl: './limitacion-cobertura.component.html',
  styles: [`.height_auto{height: auto;}`]
})

export class LimitacionCoberturaComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  // Id de la seccion
  id = 'limitacionCobertura';
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  dropdown: boolean;
  mostrarGuardar: boolean;

  form: FormGroup;
  isForm: Promise<any>;
  _esCreacion: boolean;

  pageExcepcionDiagnostico: any;
  pageCondicionPagoAntiguedad: any;
  pageSublimitesCoberturas: any;
  pageCondicionesPagoEventos: any;
  estado = true;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit() {
    // Realizamos el llamado al backend para listar por primera vez.
    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      const codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura; // codigo;
      if (codigoPlanCobertura) {
        this._listar(codigoPlanCobertura);
      }
    }));

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }
        this.planCobertura = ui;
        this.initForm(this.planCobertura.planCobertura);
      }));

  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        diasPagarEvento: new FormControl(param ? param.diasMaximoEvento : null, [Validators.required, Validators.max(999)])
      })
    );
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  async _toggle() {
    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });

      this._cerrarSeccion();
    }
  }

  _listar(codigoPlanCobertura: string, pagina = 0, tamanio = 10, sort = 'fechaCreacion,desc', estado = 'true') {

    const param: any = { 'mimPlanCobertura.codigo': codigoPlanCobertura, estado: estado, page: pagina, size: tamanio, isPaged: true, sort: sort };
    forkJoin([
      this.backService.excepcionDiagnostico.getExcepcionesDiagnosticos(param),
      this.backService.condicionPagoAntiguedad.getCondicionesPagoAntiguedad(param),
      this.backService.sublimiteCobertura.obtenerSublimitesCobertura(param),
      this.backService.condicionPagoEvento.obtenerCondicionPagoEvento(param)
    ]).subscribe(([
      _pageExcepcionDiagnostico,
      _pageCondicionPagoAntiguedad,
      _pageSublimitesCoberturas,
      _pageCondicionesPagoEventos
    ]) => {
      this.pageExcepcionDiagnostico = _pageExcepcionDiagnostico;
      this.pageCondicionPagoAntiguedad = _pageCondicionPagoAntiguedad;
      this.pageSublimitesCoberturas = _pageSublimitesCoberturas;
      this.pageCondicionesPagoEventos = _pageCondicionesPagoEventos;
      if ((this.pageExcepcionDiagnostico !== null && this.pageExcepcionDiagnostico.content.length !== 0)
        || (this.pageCondicionPagoAntiguedad !== null && this.pageCondicionPagoAntiguedad.content.length !== 0) ||
        (this.pageSublimitesCoberturas !== null && this.pageSublimitesCoberturas.content.length !== 0 ||
          this.planCobertura.planCobertura.diasMaximoEvento) || (this.pageCondicionesPagoEventos !== null && this.pageCondicionesPagoEventos.content.length !== 0)) {
        // Informamos que ya hay valores de rescate al Redux para controlar el estado del componente.
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.planCobertura.planCobertura.diasMaximoEvento,
          this.pageExcepcionDiagnostico,
          this.pageCondicionPagoAntiguedad,
          this.pageSublimitesCoberturas,
          this.pageCondicionesPagoEventos,
          this.id, Estado.Guardado
        ));
      }

    });

  }

  _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.id, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

  hasChanges() {
    return this.form && this.form.dirty;
  }

  _guardar() {

    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const param: any = { diasMaximoEvento: this.form.controls.diasPagarEvento.value };
    this.backService.planCobertura.patchPlanCobertura(this.planCobertura.planCobertura.codigo, param)
      .subscribe((respuesta: any) => {

        let estado = Estado.Pendiente;
        if (respuesta.diasMaximoEvento) {
          estado = Estado.Guardado;
        }

        // Informamos que ya hay valores de rescate al Redux para controlar el estado del componente.
        this.store.dispatch(new PostLimitacionCoberturaAction(
          this.form.controls.diasPagarEvento.value,
          this.planCobertura.excepcionDiagnostico,
          this.planCobertura.condicionPagoAntiguedad,
          this.planCobertura.sublimiteCobertura,
          this.planCobertura.condicionesPagarEvento,
          'limitacionCobertura',
          estado
        ));

        this.store.dispatch(new PostDatosPrincipalesAction(respuesta,
          this.planCobertura.guardarPlanCoberturaOrden, this.id, Estado.Guardado));

        this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
          this.frontService.alert.success(text);
        });
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });

  }

}
