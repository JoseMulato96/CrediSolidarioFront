import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValidate } from '@shared/util';
import { ValorDevolverConfig } from './valor-devolver.config';
import { Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { Subscription } from 'rxjs';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { PostValoresDevolverAction, PostValoresDevolverCanceladosAction } from '../simulaciones.actions';
import { Estado } from '../../administracion/protecciones/plan-cobertura/model/guardar-plan-cobertura-orden.model';
import { TranslateService } from '@ngx-translate/core';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-valor-devolver',
  templateUrl: './valor-devolver.component.html',
})
export class ValorDevolverComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ValorDevolverConfig = new ValorDevolverConfig();
  numeroAsociado: any = '';
  _subs: Subscription[] = [];
  id: any = 'mimValoresDevolver';
  datosAsocaido: any;

  constructor(public readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
  }

  ngOnInit(): void {
    this._subs.push(this.store.select('simulacionesUI')
      .subscribe(ui => {
        if (ui && ui.limpiar && this.configuracion.gridValorDevolver.component) {
          this.limpiarTabla();
        }
        if (!ui || !ui.mimDatosAsociados || !ui.mimDatosAsociados) {
          return;
        }
        this.datosAsocaido = ui.mimDatosAsociados;
        this.numeroAsociado = this.datosAsocaido.numInt;
        this.cargarDatos(this.datosAsocaido.numInt);
      }));
  }

  private cargarDatos(numInt) {
    this.backService.valorDevolver.obtenerValoresDevolver(numInt, MIM_PARAMETROS.MIM_VALOR_DEVOLVER.AUXILIO, MIM_PARAMETROS.MIM_VALOR_DEVOLVER.ESTADOS).subscribe(response => {
      this.configuracion.gridValorDevolver.component.limpiar();
      if (!response || !response.length) {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
        return;
      }
      this.configuracion.gridValorDevolver.component.cargarDatos(
        response,
        {
          pagina: 0,
          cantidadRegistros: response.length
        });
    });
  }

  limpiarTabla() {
    this.configuracion.gridValorDevolver.component.limpiar();
  }


  _onClickLink($event) {
    this.store.dispatch(new PostValoresDevolverAction($event, this.id, Estado.Guardado));
    this.store.dispatch(new PostValoresDevolverCanceladosAction({ estadoBoton: true }, this.id, Estado.Guardado));
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.SIMULACIONES,
      UrlRoute.VALOR_DEVOLVER_CANCELADOS
    ]);
  }


  irAtras() {
    this.router.navigate([
      UrlRoute.PAGES
    ]);
  }

  ngOnDestroy() {
    this._subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this._subs = undefined;
  }

}
