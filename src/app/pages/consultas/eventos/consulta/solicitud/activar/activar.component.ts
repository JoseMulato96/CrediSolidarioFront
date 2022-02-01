import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-activar',
  templateUrl: './activar.component.html'
})
export class ActivarComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;

  idProceso: string;
  idTarea: string;
  solicitudEvento: any;
  nombreTarea: string;
  bitacora: any;
  datosFlujo: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.nombreTarea = GENERALES.DES_FASES_FLUJO.ACTIVAR;
  }

  ngOnInit() {

    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
      this._getInitDatos();
    }));
  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
      })
    );
  }

  _getInitDatos() {
    forkJoin({
      _bitacoraProceso: this.backService.proceso.getObservacionesByIdProceso(this.idProceso),
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso)
    }).pipe(
      map(item => {
        return {
          _solicitudEvento: item._solicitudEvento,
          _tarea: item._tarea,
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
      this.idTarea = respuesta._tarea[0].taskId;
      this.solicitudEvento = respuesta._solicitudEvento;
      this.bitacora = respuesta._bitacoraProceso[0];
      this._initForm();
    });

  }

  _guardar() {

    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((validateForm: string) => {
        this.frontService.alert.warning(validateForm);
      });
      return;
    }

    const comentario = this.form.controls.observacion.value;
    const nombreProceso = this.solicitudEvento.mimEvento.nombreProceso;

    const datosActivar = {
      type: GENERALES.TIPO_COMENTARIO.ACTIVA,
      message: this.nombreTarea + comentario
    };

    this.datosFlujo = {};
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['taskId'] = this.idTarea;
    this.datosFlujo['mimSolicitudEvento'] = this.solicitudEvento;
    this.datosFlujo['variables'] = datosActivar;

    this.backService.solicitudEvento.postActivar(this.datosFlujo, nombreProceso).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES]);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

}
