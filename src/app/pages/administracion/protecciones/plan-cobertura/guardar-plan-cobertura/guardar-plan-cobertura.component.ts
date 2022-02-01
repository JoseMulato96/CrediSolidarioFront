import { Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { ObjectUtil } from '@shared/util/object.util';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { Estado } from '../model/guardar-plan-cobertura-orden.model';
import { GuardarPlanCobertura } from '../model/guardar-plan-cobertura.model';
import { CleanAction } from '../plan-cobertura.actions';
import { obtenerSeccionPorOrden } from '../plan-cobertura.reducer';

@Component({
  selector: 'app-guardar-plan-cobertura',
  templateUrl: './guardar-plan-cobertura.component.html',
  styleUrls: ['./guardar-plan-cobertura.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GuardarPlanCoberturaComponent),
      multi: true
    }
  ]
})
export class GuardarPlanCoberturaComponent extends FormValidate implements OnInit, OnDestroy {
  // form: FormGroup;
  // isForm: Promise<any>;

  _esCreacion: boolean;
  codigoPlanCobertura: string;
  planCobertura: GuardarPlanCobertura;
  _subs: Subscription[] = [];

  codigoPlan: any;
  plan: any;

  items: MenuItem[];
  items$: Observable<MenuItem[]>;
  activeIndex = 0;
  itemsCondiciones: any[] = [];

  asistencia: boolean;

  solicitud: string;
  idProceso: string;
  showForm: boolean;
  showControlsAprobacion: boolean;
  observaciones: any;
  idTarea: string;
  esDirectorTecnico: boolean;

  nombrePlan: any;
  nombreCobertura: any;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.asistencia = null;
  }

  ngOnInit() {
    // Nos subscribimos a los parametros de URL y obtener del back en plan/cobertura.
    this._subs.push(this.activatedRoute.params.subscribe(async (params: any) => {
      this.codigoPlanCobertura = params.codigoCobertura === UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLANES_NUEVO ? null : params.codigoCobertura;

      this.codigoPlan = params['codigoPlan']; // codigo
      this.solicitud = params.solicitud || null;
      this.idProceso = params.processInstanceId || null; // proceso
      this.idTarea = params.taskId || null;
      this.showControlsAprobacion = this.idTarea !== null ? true : false;

      this._esCreacion = true;
      if (this.codigoPlanCobertura) {
        this._esCreacion = false;
        // Obtenemos el nombre del plan y el nombre de la cobertura para mostrarlos como titulo
        const _planCobertura = await this.backService.planCobertura.getPlanCobertura(this.codigoPlanCobertura).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        if (!(_planCobertura && _planCobertura.mimCobertura)) { return; }
        const _cobertura = await this.backService.cobertura.obtenerCobertura(_planCobertura.mimCobertura.codigo).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        const _plan = await this.backService.planes.getPlan(_planCobertura.mimPlan.codigo).toPromise().catch(err => this.frontService.alert.error(err.error.message));
        if (!(_cobertura && _cobertura.nombre) || !(_plan && _plan.nombre)) { return; }

        this.nombrePlan = _plan.nombre;
        this.nombreCobertura = _cobertura.nombre;
      }

      if (this.idTarea) {
        this.backService.tarea.obtenerTarea(this.idTarea).subscribe((item: any) => {
          this.esDirectorTecnico = item.taskDefinitionKey === GENERALES.TIPO_USUARIO_FLUJO.DIRECTOR_TECNICO ? true : false;
        });
      }
      if (this.idProceso) {
        this.backService.proceso.getObservacionesByIdProceso(this.idProceso).subscribe(items => {
          this.observaciones = this.idProceso ? items : null;
        }, (err) => {
          this.frontService.alert.warning(err.error.message);
        });
      }
      if (this.solicitud !== null && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
        this.showForm = true;
      }


    }));
    this._subs.push(this.store.select('planCoberturaUI')
      .subscribe(ui => {
        if (!ui || !ui.planCobertura) {
          return;
        }
        this.planCobertura = ui;
        this._asignacionReducer(ui);
      }));
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new CleanAction());
  }

  _asignacionReducer(ui: any) {
    this.asistencia = ui.planCobertura.mimCobertura && ui.planCobertura.mimCobertura.asistencia;
    this.items = [{
      label: 'administracion.protecciones.planCobertura.guardar.caracteristicasBasicas.titulo',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'administracion.protecciones.planCobertura.guardar.otrasCaracteristicas.titulo',
      command: async (event: any) => {
        if (await this.validarPaso(this.activeIndex)) {
          this.activeIndex = 1;
        }
      }
    }];

    ObjectUtil.traducirObjeto(this.items, this.translate);

  }

  private async validarPaso(index: number) {
    // Validamos que pueda ir al siguiente paso.
    // index corresponde al orden del paso en el que se encuentra.
    const pasoActual = obtenerSeccionPorOrden(index, this.planCobertura.guardarPlanCoberturaOrden.items);
    const pasoSiguiente = obtenerSeccionPorOrden(index + 1, this.planCobertura.guardarPlanCoberturaOrden.items);
    // Recorremos todo el paso actual y validamos el estado de cada item.
    let puedeSeguir = true;
    for (let i = 0; i < pasoActual.items.length; i++) {
      puedeSeguir = puedeSeguir && pasoActual.items[i] && pasoActual.items[i].estado === Estado.Guardado;
    }
    if (!puedeSeguir) {
      const pasoActualTitle = await this.translate.get(pasoActual.title).toPromise();
      const pasoSiguienteTitle = await this.translate.get(pasoSiguiente.title).toPromise();
      const mensaje = await this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.debeCompletarSeccionAnterior',
        {
          anterior: pasoActualTitle,
          seccion: pasoSiguienteTitle
        }).toPromise();
      this.frontService.alert.info(mensaje);
      return false;
    }
    if (!this.planCobertura) {
      this.translate.get('administracion.protecciones.planCobertura.datosPrincipales.alertas.guardar').subscribe((respuesta: string) => {
        this.frontService.alert.info(respuesta);
      });
      return false;
    }
    return true;
  }

  _esPasoInicial(): boolean {
    return this.activeIndex === 0;
  }

  _esPasoFinal(): boolean {
    if (this.items) {
      return this.activeIndex === this.items.length - 1;
    }
    return false;
  }

  _atras() {
    if (this._esPasoInicial()) {
      return;
    }

    const anteriorPosicion = this.activeIndex - 1;
    this.items[anteriorPosicion].command();
  }

  async _siguiente() {
    if (this._esPasoFinal()) {
      return;
    }

    const siguientePosicion = this.activeIndex + 1;
    this.items[siguientePosicion].command();
  }

  async _finalizar() {

    // Validamos que pueda finalizar
    // activeIndex corresponde al orden del paso en el que se encuentra.
    const pasoActual = obtenerSeccionPorOrden(this.activeIndex, this.planCobertura.guardarPlanCoberturaOrden.items).items;
    // Recorremos todo el paso actual y validamos el estado de cada item.
    let puedeFinalizar = true;
    for (let i = 0; i < pasoActual.length; i++) {
      // Verifica en la configuracion realizada en datos principales, si la card es requerido
      if (this.planCobertura.planCobertura[pasoActual[i].id]) {
        puedeFinalizar = puedeFinalizar && pasoActual[i] && pasoActual[i].estado === Estado.Guardado;
        if (!puedeFinalizar) {
          const pasoActualTitle = await this.translate.get(pasoActual[i].title).toPromise();
          const mensaje = await this.translate.get('administracion.protecciones.planCobertura.guardar.alertas.debeCompletarSeccionActual',
            {
              actual: pasoActualTitle
            }).toPromise();
          this.frontService.alert.info(mensaje);
          return;
        }
      }

    }

    this.irALIstar();
  }

  irALIstar() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.ADMINISTRACION,
      UrlRoute.ADMINSTRACION_PROTECCIONES,
      UrlRoute.ADMINISTRACION_PROTECCIONES_PLAN_COBERTURA,
      UrlRoute.ADMINISTRACION_PROTECCIONES_GESTION_PLAN_PLAN,
      this.planCobertura.planCobertura.mimPlan.codigo]);
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return false;
  }

  /* Metodos para el flujo de eliminacion */
  /* Para el flujo de eliminacion */
  _guardarObservacion(datos: any) {
    const _datos = {
      ...datos,
      codigoPlanCobertura: this.codigoPlanCobertura,
      codigoPlan: this.codigoPlan,
      codigoSolicitudPadre: GENERALES.CODIGO_SOLICITUD_PADRE,
      codigoSolicitud: this.codigoPlanCobertura.toString(),
      nombreSolicitud: this.planCobertura.planCobertura.nombre,
      codigoTipoSolicitud: GENERALES.TIPO_SOLICITUD.CODIGO_TIPO_SOLICITUD_ELIMINAR_PLAN_COBERTURA,
      nombreTipoSolicitud: GENERALES.TIPO_SOLICITUD.NOMBRE_TIPO_SOLICITUD_ELIMINAR_PLAN_COBERTURA

    };

    this.backService.proceso.iniciarProceso(GENERALES.PROCESO.ELIMINAR_PLAN_COBERTURA, _datos).subscribe((resp: any) => {

      this.translate.get('global.solicitudEliminacionEnviada').subscribe((getMensaje: string) => {
        this.translate.get('global.solicitudEliminacionMensaje', { mensaje: getMensaje, numero: resp }).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje);
        });
      });

      this.irALIstar();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _apruebaRechazaSolicitud(datos: any) {
    if (this.esDirectorTecnico) {
      datos.aprobacionDirectorTecnico = datos.aprobar;
    } else {
      datos.aprobacionAnalistaTecnico = datos.aprobar;
    }
    this.backService.tarea.completarTarea(this.idTarea, datos).subscribe((resp: any) => {

      this.translate.get(datos.aprobar ? 'global.finalizaFlujo' : 'global.solicitudRechazadaMensaje').subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje);
      });

      this.router.navigate([UrlRoute.PAGES, UrlRoute.HOME]);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _toggleObservaciones(showModal?: boolean) {
    if (!showModal && this.solicitud === UrlRoute.SOLICITUD_ELIMINACION) {
      this.irALIstar();
    }
  }

}
