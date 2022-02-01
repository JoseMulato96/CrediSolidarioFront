import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DataService } from '@core/store/data.service';
import { AppState } from '@core/store/reducers';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as acciones from '../portafolio.actions';
import { ActivarSolicitudesSuspendidasConfig } from './activar-solicitudes-suspendidas.config';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-activar-solicitudes-suspendidas',
  templateUrl: './activar-solicitudes-suspendidas.component.html',
})
export class ActivarSolicitudesSuspendidasComponent extends FormValidate implements OnInit, OnDestroy {

  configuracion: ActivarSolicitudesSuspendidasConfig = new ActivarSolicitudesSuspendidasConfig();
  subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;
  idProceso: string;
  task: any;
  taskId: string;
  asoNumInt: string;
  datosAsociado: any;
  venta: any;
  idTarea: string;
  solicitudEvento: any;
  bitacora: any;


  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly store: Store<AppState>,
    private readonly formBuilde: FormBuilder,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService

  ) { super(); }


  ngOnInit(): void {
    this.store.dispatch(acciones.mostrarMenuConsultas({ datos: false }));
    this.actionsRouterParams();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private actionsRouterParams() {
    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.subs.push(
      this.route.params.subscribe(params => {
        this.idProceso = params.processInstanceId;
        this.taskId = params.taskId;
      })
    );

    this.subs.push(
      this.route.parent.parent.parent.parent.parent.params.subscribe(params => {
        this.asoNumInt = params.asoNumInt;
        if (!this.asoNumInt) {
          return;
        }
      })
    );

    this.subs.push(this.dataService.asociados().asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
      if (!respuesta) { return; }
      this.datosAsociado = respuesta.datosAsociado;
      this.dataInit();
    })
    );
  }

  private initForm(param?: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilde.group({
        observacion: [null, [Validators.required]]
      })
    );
  }


  private dataInit() {
    forkJoin({
      _venta: this.backService.venta.getVenta({ 'idProceso': this.idProceso }),
      _task: this.backService.proceso.getTareasPorIdProceso(this.idProceso)
    }).subscribe(async (resp: any) => {
      if (resp._venta.content.length > 0) {
        this.venta = resp._venta.content[0];
        this.configuracion.detalleEvento.title = 'Datos de la solicitud';
        this.configuracion.detalleEvento.component.cargarDatos(this.venta);
      }
      this.task = resp._task[0];
      this._getInitDatos();
    });
  }

  _getInitDatos() {
    forkJoin({
      _bitacoraProceso: this.backService.proceso.getObservacionesByIdProceso(this.idProceso),
    }).pipe(
      map(item => {
        return {
          _bitacoraProceso: item._bitacoraProceso.map(t => {
            return {
              nombreFase: t.comment.includes(':') ? t.comment.split(':')[0] : '',
              observacion: t.comment.includes(':') ? t.comment.split(':')[1] : t.comment,
              nombreUsuario: t.user.name,
              fecha: String(t.time || '').substr(0, 10),
              hora: String(t.time || '').substr(10)
            };
          })
        };
      })
    ).subscribe((respuesta: any) => {
      this.bitacora = respuesta._bitacoraProceso[0];
      this.initForm();
    });
  }


  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    // Configuramos las observaciones.
    const variables = {} as any;
    variables.comment = this.form.controls.observacion.value;
    this.venta.variables = variables;

    // Servicio para enviar el archivo
    this.backService.venta.postActivarSolicitudesSuspendidas(this.venta).subscribe((mimVenta: any) => {
      this.initForm();
      this.frontService.alert.success(mimVenta.message).then(() => {
        this.onAtras();
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  onAtras() {
    this.router.navigate([
      UrlRoute.PAGES,
      UrlRoute.CONSULTAS,
      UrlRoute.CONSULTAS_ASOCIADO,
      this.asoNumInt,
      UrlRoute.PROTECCIONES,
      UrlRoute.PORTAFOLIO_BETA,
      UrlRoute.PORTAFOLIO_PLAN_COBERTURA_MOVIMIENTOS
    ]);
  }

}
