import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { GuardarPlanCobertura } from '../../../model/guardar-plan-cobertura.model';
import { Estado } from '../../../model/guardar-plan-cobertura-orden.model';
import { obtenerSeccionPorId } from '../../../plan-cobertura.reducer';
import { Subscription } from 'rxjs';
import { UrlRoute } from '@shared/static/urls/url-route';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-coberturas-subsistentes-parent',
  templateUrl: './coberturas-subsistentes-parent.component.html',
})
export class CoberturrasSubsistentesParentComponent implements OnInit, OnDestroy {

  
  planCobertura: GuardarPlanCobertura;
  idCoberturasSubsistentes = 'coberturasSubsistentes';
  dropdown: boolean = false;
  mostrarGuardar: boolean;
  _subs: Subscription[] = [];
  codigoPlanCobertura;

  constructor(private readonly activatedRoute: ActivatedRoute,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService,
    private readonly store: Store<AppState>,) { }

  ngOnInit(): void {

    this._subs.push(this.activatedRoute.params.subscribe((params: any) => {
      this.codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;
    }));

    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }
        this.planCobertura = ui;
      }));
  }

  async _toggle() {

    if (this.planCobertura) {
      this.dropdown = !this.dropdown;
    } else {
      this.translate.get('administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.alertService.info(respuesta);
      });
      this._cerrarSeccion();
    }
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  private _cerrarSeccion() {
    this.dropdown = false;
    this.mostrarGuardar = false;
    //this.subsistentePlanCoberturaDetalle = undefined;
  }

  _obtenerEstado(): string {
    if (!this.planCobertura) {
      return Estado.Pendiente;
    }

    const seccion = obtenerSeccionPorId(this.idCoberturasSubsistentes, this.planCobertura.guardarPlanCoberturaOrden);
    return seccion ? seccion.estado : Estado.Pendiente;
  }

}
