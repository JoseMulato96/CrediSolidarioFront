import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { masksPatterns } from '@shared/util/masks.util';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DataService } from '@core/store/data.service';
import { FormValidate } from '@shared/util';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { ValorDevolverConfig } from './valor-devolver/valor-devolver.config';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { PostDatosAsociadosAction, PostValoresDevolverCanceladosAction, PostLimpiarTablaAction } from './simulaciones.actions';
import { Estado } from './models/Estados';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-simulaciones',
  templateUrl: './simulaciones.component.html',
})
export class SimulacionesComponent extends FormValidate implements OnInit {

  form: FormGroup;
  isForm: Promise<any>;
  patterns = masksPatterns;
  tiposDocumentos: any[];
  id: any = 'mimDatosAsociados';
  idEventoLimpiar: any = 'mimLimpiarDatosTabla';
  datosAsociado: any = {};
  _subs: Subscription[] = [];
  showTableDetailCancelPlan = false;
  numeroAsociado: any;
  configuracion: ValorDevolverConfig = new ValorDevolverConfig();
  showBotonRegresar: boolean;

  constructor(public readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
  ) {
    super();
  }


  ngOnInit(): void {
    this.getTipoDocumentos();
    this.initFormGroup();
    this._subs.push(this.store.select('simulacionesUI')
      .subscribe(ui => {
        if (!ui || !ui.mimValoresDevolverCancelacion) {
          return;
        }
        this.showBotonRegresar = ui.mimValoresDevolverCancelacion.estadoBoton;
      }));
  }

  private initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        tipoDocumento: ['', Validators.required],
        numeroDocumento: ['', Validators.required]
      }));
  }


  private getTipoDocumentos() {
    this.backService.parametro.getParametros(20).subscribe(_tiposDocumentos => {
      this.tiposDocumentos = _tiposDocumentos;
    }, err => {
      this.frontService.alert.error(err.error.message);
    });
  }

  onLimpiar() {
    this.form.reset();
    this.store.dispatch(new PostDatosAsociadosAction(null, this.id, Estado.Guardado));
    this.store.dispatch(new PostLimpiarTablaAction(true, this.idEventoLimpiar, Estado.Guardado));
    this.store.dispatch(new PostValoresDevolverCanceladosAction({ estadoBoton: false }, this.id, Estado.Guardado));
  }

  onBuscar() {
    if (!this.validarForm()) {
      return;
    }
    this.getDataAsociado();
  }

  private validarForm() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate
        .get('global.validateForm')
        .subscribe(texto => {
          this.frontService.alert.warning(texto);
        });
      return false;
    }
    return true;
  }

  private getDataAsociado() {
    const nitCli = this.form.controls.numeroDocumento.value;
    const tipDoc = this.form.controls.tipoDocumento.value.sipParametrosPK.codigo;
    this.numeroAsociado = this.form.controls.numeroDocumento.value;
    this.store.dispatch(new PostValoresDevolverCanceladosAction({ estadoBoton: false }, this.id, Estado.Guardado));
    this.backService.asociado.buscarAsociado({ tipDoc, nitCli, isPaged: true, page: 0, size: 1 }).subscribe((respuesta: any) => {
      if (respuesta.content.length > 0) {
        respuesta.content.forEach(element => {
          this._subs.push(
            this.dataService.asociados().asociado
              .subscribe((respuesta: DatosAsociadoWrapper) => {
                if (!respuesta ||
                  respuesta.datosAsociado.numInt !== element.numInt) {
                  this.publicarDatosAsociado(element.numInt);
                  return;
                }
                this.datosAsociado = respuesta.datosAsociado;
                this.datosAsociado.numeroAsociado = nitCli;
                this.datosAsociado.tipDoc = tipDoc;
                this.datosAsociado.numInt = element.numInt;
                this.store.dispatch(new PostDatosAsociadosAction(this.datosAsociado, this.id, Estado.Guardado));
                this.router.navigate([
                  UrlRoute.PAGES,
                  UrlRoute.SIMULACIONES,
                  UrlRoute.VALOR_DEVOLVER
                ]);
              }));
        });
      } else {
        this.translate.get('global.noSeEncontraronRegistrosMensaje').subscribe(text => {
          this.frontService.alert.info(text);
        });
      }
    });
  }

  private publicarDatosAsociado(asoNumInt: any) {
    this.dataService
      .asociados()
      .accion(Acciones.Publicar, asoNumInt, true);
  }


  irAtras_valores_devolver() {
    this.store.dispatch(new PostValoresDevolverCanceladosAction({ estadoBoton: false }, this.id, Estado.Guardado));
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.SIMULACIONES,
      UrlRoute.VALOR_DEVOLVER
    ]);
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

}
