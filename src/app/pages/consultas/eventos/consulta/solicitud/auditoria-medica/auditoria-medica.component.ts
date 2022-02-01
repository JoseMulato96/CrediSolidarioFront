import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { TranslateService } from '@ngx-translate/core';
import { UrlRoute } from '@shared/static/urls/url-route';
import { DateUtil } from '@shared/util/date.util';
import { MimGeneraCartaComponent } from '@shared/components/mim-genera-carta/mim-genera-carta.component';
import { FormValidate } from '@shared/util';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-auditoria-medica',
  templateUrl: './auditoria-medica.component.html',
})
export class AuditoriaMedicaComponent extends FormValidate implements OnInit, OnDestroy {

  @ViewChild(MimGeneraCartaComponent) mimGeneraCartaComponent: MimGeneraCartaComponent;

  _subs: Subscription[] = [];
  form: FormGroup;
  isForm: Promise<any>;

  datosFlujo: any;
  suspenderFlujo: boolean;
  conceptoFavorable: boolean;
  errorRadicacion: boolean;
  conceptoOtrasAreas: boolean;
  guardarComentario: boolean;

  origenEvento: any[];
  conceptoMedico: any[];
  razonesNegacion: any[];
  subEstados: any[];

  codigoDetalleSolicitudEvento: number;
  dataInitGestionPendientePor: any;

  mostrarBitacora: boolean;
  envioCarta: boolean;
  cartaDiligenciada: boolean;
  contenidoCarta: string;
  idProceso: string;
  idTarea: string;
  solicitudEvento: any;
  faseFlujo: number;
  asoNumInt: string;
  labelRemedy: string;

  maxDate: Date = new Date();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly router: Router
  ) {
    super();
    this.origenEvento = [];
    this.conceptoMedico = [];
    this.razonesNegacion = [];
    this.mostrarBitacora = true;
    this.conceptoOtrasAreas = false;
    this.faseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.AUDITORIA_MEDICA;
  }

  ngOnInit() {

    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
      this._getData();
      if (this.mostrarBitacora) {
        return;
      }
    }));

    this.translate.get('eventos.consulta.solicitud.numeroRemedy').subscribe((text: string) => {
      this.labelRemedy = text;
    });
  }

  _initForm(param?: any) {
    const detalle = param ? param.mimSolicitudEventoDetalleList[0] : null;
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        origenEvento: new FormControl(detalle ? this._setCobertura(param) : null, [Validators.required]),
        fechaEvento: new FormControl(param ? DateUtil.stringToDate(param.fechaEvento) : null, [Validators.required]),
        conceptoMedico: new FormControl(detalle && detalle.mimConceptoAuditor ? this._setConceptoMedico(detalle.mimConceptoAuditor.codigo) : null, [Validators.required]),
        razonesNegacion: new FormControl(detalle && detalle.mimRazonNegacionAuditor ? this._setRazonNegacion(detalle.mimRazonNegacionAuditor.codigo) : null),
        gestionPendientePor: this.formBuilder.group({
          subestados: [null],
          numeroRemedy: [null]
        }),
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
      })
    );

    if (detalle && detalle.mimConceptoAuditor) {
      this.validarConcepto(detalle.mimConceptoAuditor.codigo);
    }

    this.changeConceptoAuditor();
    this.changeGestionPendientePor();
    this.form.controls.razonesNegacion.disable();
    this.form.controls.gestionPendientePor['controls'].numeroRemedy.disable();

    if (detalle && detalle.codigo) {
      this.codigoDetalleSolicitudEvento = detalle.codigo;
    }

  }

  validarConcepto(codigoConcepto) {
    this.envioCarta = codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_DESFAVORABLE ||
        codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_SOLICITUD_INFORMACION ? true : false;
      this.suspenderFlujo = codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_SOLICITUD_INFORMACION ? true : false;
      this.conceptoFavorable = codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_FAVORABLE ? true : false;
      this.errorRadicacion = codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_DEVOLUCION_ERROR ? true : false;
  }

  _setCobertura(param: any) {

    const detalle = param ? param.mimSolicitudEventoDetalleList[0] : null;
    const codigoSublimite = param && param.mimSublimiteCobertura ? param.mimSublimiteCobertura.codigo : null;

    return this.origenEvento.find(item => item.codigoPlan === detalle.codigoPlan &&
      item.codigoCobertura === detalle.codigoCobertura &&
      item.codigoSublimite === codigoSublimite);
  }

  _setConceptoMedico(codigo: string) {
    return this.conceptoMedico.find(item => item.codigo === codigo);
  }

  _setRazonNegacion(codigo: string) {
    return this.razonesNegacion.find(item => item.codigo === codigo);
  }

  changeConceptoAuditor() {

    this.form.controls.conceptoMedico.valueChanges.subscribe(item => {
      const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
      if (item === null || item === undefined) {
        return;
      }

      const codigoConcepto = item.codigo;
      this.form.controls.conceptoMedico.setValidators([Validators.required]);

      this.form.controls.razonesNegacion.setValidators(null);
      this.form.controls.razonesNegacion.setValue(null);
      this.form.controls.razonesNegacion.disable();

      gestionPendientePor.subestados.setValidators(null);
      gestionPendientePor.subestados.setValue(null);
      gestionPendientePor.subestados.disable();

      gestionPendientePor.numeroRemedy.setValidators(null);
      gestionPendientePor.numeroRemedy.setValue(null);
      gestionPendientePor.numeroRemedy.disable();

      this.validarConcepto(codigoConcepto);

      if (codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_DESFAVORABLE) {
        this.form.controls.razonesNegacion.setValidators([Validators.required]);
        this.form.controls.razonesNegacion.enable();

      } else if (codigoConcepto === MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_AUDITORIA_MEDICA_DEVOLUCION_ERROR) {
        this.frontService.alert.confirm(this.translate.instant('global.devolucionPorError')).then((respuesta: boolean) => {
          if (respuesta) {
            this.errorRadicacion = true;
          } else {
            this.errorRadicacion = false;
          }
        });

      } else if (codigoConcepto === null) {
        gestionPendientePor.subestados.setValidators([Validators.required]);
        gestionPendientePor.subestados.enable();
      }

      if (this.envioCarta) {
        this.mimGeneraCartaComponent.cargarDatos(codigoConcepto);
      }

    });

  }

  changeGestionPendientePor() {

    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    gestionPendientePor.subestados.valueChanges.subscribe(item => {
      if (item) {

        this.conceptoOtrasAreas = item.mimTipoGestion.codigo === GENERALES.TIPO_GESTION.CONCEPTO_OTRAS_AREAS ? true : false;
        this.guardarComentario = item.mimTipoGestion.codigo === GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO ? true : false;

        this.form.controls.conceptoMedico.setValidators(null);
        this.form.controls.conceptoMedico.setValue(null);
        this.form.controls.razonesNegacion.setValidators(null);
        this.form.controls.razonesNegacion.setValue(null);
        this.form.controls.razonesNegacion.disable();

        if (item.codigo === GENERALES.MIM_SUBESTADOS.REMEDY) {
          gestionPendientePor.numeroRemedy.setValidators([Validators.required]);
          gestionPendientePor.numeroRemedy.enable();
        } else {
          gestionPendientePor.numeroRemedy.setValidators(null);
          gestionPendientePor.numeroRemedy.setValue(null);
          gestionPendientePor.numeroRemedy.disable();
        }

      } else {
        return;
      }
    });
  }

  _getData() {

    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _conceptoMedico: this.backService.conceptoTareaFlujo.getConceptoTareaFlujo({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.MEDICAMENTOS,
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.AUDITORIA_MEDICA
      }),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso),
      _subestados: this.backService.faseSubestado.getFasesSubestados({codigoFaseFlujo: GENERALES.TIPO_FASE_FLUJO.AUDITORIA_MEDICA}),
      _razonesNegacion: this.backService.razonNegacion.getRazonesNegacion({
        'mimFaseFlujo.mimFaseProcesoSet.mimFaseProcesoPK.codigoProceso': GENERALES.PROCESO.MEDICAMENTOS,
        'mimFaseFlujo.codigo': MIM_PARAMETROS.MIM_FASE_FLUJO.AUDITORIA_MEDICA
      })
    }).pipe(
      map((item: any) => {
        return {
          _solicitudEvento: item._solicitudEvento,
          _conceptoMedico: item._conceptoMedico,
          _tarea: item._tarea,
          _subestados: item._subestados.map(y => y.mimSubestado),
          _razonesNegacion: item._razonesNegacion,
        };
      })
    ).subscribe(item => {
      this.idTarea = item._tarea[0].taskId;
      this.solicitudEvento = item._solicitudEvento;
      this.conceptoMedico = item._conceptoMedico._embedded.mimConceptoTareaFlujo;
      this.conceptoMedico.unshift({ codigo: null, nombre: 'Seleccionar' });

      this.subEstados = item._subestados;
      this.subEstados.unshift({ codigo: null, nombre: 'Seleccionar' });
      this.dataInitGestionPendientePor = this.subEstados;

      this.razonesNegacion = item._razonesNegacion._embedded.mimRazonNegacion || null;

      this.backService.eventoCobertura.getEventosCobertura({ asoNumInt: this.asoNumInt, codigoEvento: this.solicitudEvento.mimEvento.codigo }).subscribe(origenEvento => {
        this.origenEvento = origenEvento;
        this._initForm(this.solicitudEvento);
      });


    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });

  }

  _getDatosFlujo() {
    const _form = this.form.getRawValue();
    this.solicitudEvento.mimSolicitudEventoDetalleList = [
      {
        codigoPlan: _form.origenEvento.codigoPlan,
        codigoCobertura: _form.origenEvento.codigoCobertura,
        mimSolicitudEvento: {
          codigo: this.idProceso
        },
        mimEstadoSolicitudEventoDetalle: {
          codigo: 1
        },
        mimConceptoAuditor: _form.conceptoMedico ? { codigo: _form.conceptoMedico.codigo } : null,
        mimRazonNegacionAuditor: _form.razonesNegacion ? { codigo: _form.razonesNegacion.codigo } : null,
        valorProteccionBase: this.solicitudEvento.valorSolicitado
      }
    ];

    if (this.codigoDetalleSolicitudEvento) {
      this.solicitudEvento.mimSolicitudEventoDetalleList[0].codigo = this.codigoDetalleSolicitudEvento;
    }

    this.solicitudEvento.fechaEvento = DateUtil.dateToString(_form.fechaEvento, 'dd-MM-yyyy');
    if (_form.origenEvento.codigoSublimite) {
      this.solicitudEvento.mimSublimiteCobertura = {
        codigo: _form.origenEvento.codigoSublimite
      };
    } else {
      this.solicitudEvento.mimSublimiteCobertura = null;
    }

    this.datosFlujo = {};
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['taskId'] = this.idTarea;
    this.datosFlujo['mimSolicitudEvento'] = this.solicitudEvento;

    let datosAuditoriaMedica = {};
    let comentario = GENERALES.DES_FASES_FLUJO.AUDITORIA_MEDICA + _form.observacion;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];

    // Si se suspende el flujo
    if (this.suspenderFlujo) {
      datosAuditoriaMedica = {
        type: GENERALES.TIPO_COMENTARIO.SUSPENDIDO,
        message: comentario,
        contenidoCarta: this.contenidoCarta
      };

      // Si se devuelve por error o se envia a negación el flujo o se envia a concepto otras áreas
    } else {

      // Si se envía a concepto otras áreas
      if (this.conceptoOtrasAreas) {

        datosAuditoriaMedica = {
          comment: comentario,
          otraArea: this.conceptoOtrasAreas,
          areaDesignada: gestionPendientePor.subestados.value.codigo
        };

        // Si se devuelve por error o se envia a negación el flujo o se guarda comentario
      } else {

        // Si viene de gestión pendiente por
        if (this.guardarComentario) {

          if (gestionPendientePor.numeroRemedy.value) {
            const comnentarioRemedy = [this.labelRemedy, gestionPendientePor.numeroRemedy.value, comentario];
            comentario = comnentarioRemedy.join(' ');
          }

          datosAuditoriaMedica = {
            type: GENERALES.TIPO_COMENTARIO.GESTION,
            message: comentario
          };

          // Si se devuelve por error o se envia a negación el flujo
        } else {
          datosAuditoriaMedica = {
            comment: comentario,
            errorRadicacion: this.errorRadicacion,
            conceptoAuditoriaMediacaFavorable: this.conceptoFavorable,
            otraArea: this.conceptoOtrasAreas,
            contenidoCarta: this.contenidoCarta
          };
        }
      }
    }

    this.datosFlujo['variables'] = datosAuditoriaMedica;

    return this.datosFlujo;
  }

  gestionar() {
    this.mostrarBitacora = !this.mostrarBitacora;
  }

  guardar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this.envioCarta && !this.cartaDiligenciada) {
      this.translate.get('global.diligenciarCarta').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const codigoEvento = this.solicitudEvento.mimEvento.nombreProceso;
    this.backService.solicitudEvento.postAuditoriaMedica(this._getDatosFlujo(), codigoEvento).subscribe(respuesta => {
      this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
        this._initForm();
        this.frontService.alert.success(mensaje).then(() => {
          this.router.navigate([UrlRoute.PAGES]);
        });
      });
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  cartaGenerada(event) {
    this.cartaDiligenciada = true;
    this.contenidoCarta = event;
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.isPristine(this.form) && this.form && this.form.dirty;
  }

}
