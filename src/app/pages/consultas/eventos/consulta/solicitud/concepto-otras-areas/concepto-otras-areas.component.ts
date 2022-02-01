import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormComponent } from '@core/guards';
import { FormValidate } from '@shared/util';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { TranslateService } from '@ngx-translate/core';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-concepto-otras-areas',
  templateUrl: './concepto-otras-areas.component.html'
})
export class ConceptoOtrasAreasComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;

  idProceso: string;
  idSubproceso: string;
  idSubtarea: string;
  nombreSubtarea: string;
  usuarioTarea: string;
  nombreTarea: string;
  bitacora: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
    ) {
      super();
    }

  ngOnInit() {
    this._subs.push(this.route.params.subscribe((params) => {
      this.idSubproceso = params.idSubproceso;
      this.backService.proceso.getProcesoPadrePorIdSubproceso(this.idSubproceso).subscribe(proceso => {
        this.idProceso = proceso.processInstanceId;
        this._getInitDatos();
      });
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
      _subTarea: this.backService.proceso.getTareasPorIdProceso(this.idSubproceso)
    }).pipe(
      map(item => {
        return {
          _bitacoraProceso: item._bitacoraProceso.map(t => {
            return {
              nombreFase: t.comment.includes(':') ? t.comment.split(':')[0] : '',
              observacion: t.comment.includes(':') ? this.getComment(t.comment) : t.comment,
              nombreUsuario: t.user.name,
              fecha: String(t.time || '').substr(0, 10),
              hora:  String(t.time || '').substr(10)
            };
          }),
          _subTarea: item._subTarea[0]
        };
      })
    ).subscribe((respuesta: any) => {
      this.idSubtarea = respuesta._subTarea.taskId;
      this.nombreSubtarea = respuesta._subTarea.name;
      this.bitacora = respuesta._bitacoraProceso[0];
      this. _initForm();
    });

  }

  getComment(comentario) {
    const indice = comentario.indexOf(':') + 1;
    return comentario.substring(indice, comentario.length);
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

    // Se envia nuevamente a la fase de la que vino
    this.backService.tarea.completarTarea(this.idSubtarea, {comment: this.nombreSubtarea + ': ' + comentario }).subscribe(respuesta => {
      this.backService.proceso.getTareasPorIdProceso(this.idProceso, {includeAssigneeInfo: true}).subscribe(resultado => {
        const tarea = resultado[0];
        this.usuarioTarea = tarea.userInfo ? tarea.userInfo.name : null;
        this.nombreTarea = tarea.name;

        this.translate.get('global.otrasAreas', {idProceso: this.idProceso, usuarioProceso : this.usuarioTarea,
          faseProceso: this.nombreTarea}).subscribe((mensaje: string) => {
          this.frontService.alert.success(mensaje).then(() => {
            this.router.navigate([UrlRoute.PAGES]);
          });
        });

      }, err => {
        this.frontService.alert.error(err.error.message);
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
