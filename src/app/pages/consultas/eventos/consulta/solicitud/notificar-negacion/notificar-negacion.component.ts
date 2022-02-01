import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';


@Component({
  selector: 'app-notificar-negacion',
  templateUrl: './notificar-negacion.component.html',
  styleUrls: ['./notificar-negacion.component.css']
})
export class NotificarNegacionComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  _subs: Subscription[] = [];
  _isForm: Promise<any>;
  form: FormGroup;
  subestados: any[] = [];
  razonesInsatisfacion: any[];
  gestionPendientes: any[] = [];
  auditores: any[];
  asoNumInt: string;
  idProceso: string;
  idTarea: string;
  mostrarBitacora: boolean;
  activarGuardar: boolean;
  activarTerminar: boolean;
  terminarFlujo: boolean;
  datosFlujo: any;
  solicitudEvento: any;

  constructor
    (
      private readonly router: Router,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder,
      private readonly translate: TranslateService,
      private readonly frontService: FrontFacadeService,
      private readonly backService: BackFacadeService
    ) {
    super();
    this.mostrarBitacora = true;
  }

  ngOnInit() {

    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
      if (this.mostrarBitacora) {
        this._getInitDatos();
      }

    }));

  }

  _initForm() {
    this._isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        descripcionNegacion: new FormControl(null, [Validators.required]),
        tratamientoEspecial: new FormControl(false),
        subestados: new FormControl(null),
        gestionPendiente: new FormControl(null),
        auditores: new FormControl(null),
        razonInsatisfacion: new FormControl(null, [Validators.required])
      })
    );

    this.form.controls.auditores.disable();
    this.form.controls.razonInsatisfacion.disable();

    this._change();
  }

  _change() {
    this.form.controls.gestionPendiente.valueChanges.subscribe(item => {
      if (item) {
        this.form.controls.subestados.setValue(null);
        this.form.controls.razonInsatisfacion.setValue(null);
        this.form.controls.razonInsatisfacion.disable();
        this.activarGuardar = true;
        this.activarTerminar = false;
        if (item.codigo === MIM_PARAMETROS.MIM_SUBESTADO.NECESITA_TELECONFERENCIA_AUDITOR) {
          this.form.controls.auditores.enable();
        }
      }
    });

    this.form.controls.subestados.valueChanges.subscribe(item => {
      if (item) {
        this.form.controls.gestionPendiente.setValue(null);
        this.form.controls.auditores.setValue(null);
        this.form.controls.auditores.disable();
        this.activarGuardar = false;
        this.activarTerminar = true;
        if (item.codigo === MIM_PARAMETROS.MIM_ESTADO_CIERRE.ASOCIADO_INSATISFECHO) {
          this.form.controls.razonInsatisfacion.enable();
        } else {
          this.form.controls.razonInsatisfacion.disable();
        }
      }
    });
  }

  _getInitDatos() {

    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _tareas: this.backService.proceso.getTareasPorIdProceso(this.idProceso),
      _estadosCierre: this.backService.estadoCierre.getEstadosCierre({ negacion: true }),
      _razonInsatisfaccion: this.backService.razonInsatisfaccion.getRazonesInsatisfaccion({}),
      _faseSubestado: this.backService.faseSubestado.getFasesSubestados({ codigoFaseFlujo: GENERALES.TIPO_FASE_FLUJO.NEGACION }),
      _auditores: this.backService.sispro.getUsuariosPorRol(GENERALES.ROLES_ID.MM_F7)
    })
      .pipe(
        map(item => {
          return {
            ...item,
            _faseSubestado: item._faseSubestado.map(x => x.mimSubestado),
            _auditores: item._auditores.map(t => {
              return {
                codigo: t.identification,
                nombre: t.name
              };
            })
          };
        })
      )
      .subscribe(respuestas => {
        this.idTarea = respuestas._tareas[0].taskId;
        this.solicitudEvento = respuestas._solicitudEvento;
        this.subestados.push({ codigo: null, nombre: 'Seleccionar' });
        respuestas._estadosCierre._embedded.mimEstadoCierre.map(x => this.subestados.push(x));

        this.razonesInsatisfacion = respuestas._razonInsatisfaccion._embedded.mimRazonInsatisfaccion;
        this.gestionPendientes.push({ codigo: null, nombre: 'Seleccionar' });
        respuestas._faseSubestado.map(x => this.gestionPendientes.push(x));

        this.auditores = respuestas._auditores;
        this._initForm();
      }, (err) => {
        this.frontService.alert.error(err.error.message);
      });
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

  gestionar() {
    this.mostrarBitacora = !this.mostrarBitacora;
  }

  _alGuardar() {
    this.terminarFlujo = false;
    this._guardarDatosFlujo();
  }

  _terminar() {
    this.terminarFlujo = true;
    this._guardarDatosFlujo();
  }

  _guardarDatosFlujo() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }
    const _form = this.form.getRawValue();

    const mimNotificacionEvento = {
      codigoSolicitudEvento: this.idProceso,
      mimSolicitudEvento: { codigo: this.idProceso },
      mimEstadoCierre: _form.subestados ? { codigo: _form.subestados.codigo } : null,
      mimRazonInsatisfaccion: _form.razonInsatisfacion ? { codigo: _form.razonInsatisfacion.codigo } : null,
      observaciones: _form.descripcionNegacion || null,
      tratamientoEspecial: _form.tratamientoEspecial || false
    };

    this.datosFlujo = {};
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['taskId'] = this.idTarea;
    this.datosFlujo['mimSolicitudEvento'] = this.solicitudEvento;
    this.datosFlujo['mimNotificacionEvento'] = mimNotificacionEvento;

    let comentario = _form.descripcionNegacion;
    if (this.terminarFlujo) {
      comentario = comentario + '||' + _form.subestados.codigo;
      if (_form.razonInsatisfacion) {
        comentario = comentario + '||' + _form.razonInsatisfacion.codigo;
      }

    } else {
      comentario = comentario + '||' + _form.gestionPendiente.codigo;
      if (_form.auditores) {
        comentario = comentario + '||' + _form.auditores.codigo;
      }
    }

    const datosNotificaNegacion = {
      message: GENERALES.DES_FASES_FLUJO.NOTIFICAR_NEGACION + comentario,
      type: GENERALES.TIPO_COMENTARIO.NEGACION,
      termina: this.terminarFlujo
    };

    this.datosFlujo['variables'] = datosNotificaNegacion;

    const nombreProceso = this.solicitudEvento.mimEvento.nombreProceso;
    this.backService.solicitudEvento.postNotificarNegacion(this.datosFlujo, nombreProceso).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this.frontService.alert.success(mensaje).then(() => {
          this._initForm();
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

}
