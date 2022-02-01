import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/guards';
import { BackFacadeService } from '@core/services/back-facade.service';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { MimValoresEventoComponent } from '@shared/components/mim-valores-evento/mim-valores-evento.component';
import { IValoresEvento } from '@shared/models/valores-evento.model';
import { GENERALES } from '@shared/static/constantes/constantes';
import { MIM_PARAMETROS } from '@shared/static/constantes/mim-parametros';
import { UrlRoute } from '@shared/static/urls/url-route';
import { FormValidate } from '@shared/util';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-radicar',
  templateUrl: './radicar.component.html'
})
export class RadicarComponent extends FormValidate implements OnInit, OnDestroy, FormComponent {

  @ViewChild(MimValoresEventoComponent) valoresEventoComponent: MimValoresEventoComponent;

  _subs: Subscription[] = [];

  mostrarBitacora: boolean;
  conceptoOtrasAreas: boolean;
  guardarComentario: boolean;
  peticionSegundaVez: boolean;

  form: FormGroup;
  formValorEvento: FormGroup;
  isForm: Promise<any>;

  envioCarta: boolean;
  asoNumInt: string;

  idProceso: string;
  idTarea: string;
  solicitudEvento: any;
  faseFlujo: number;
  conceptoFlujo: number;
  tipoFaseFlujo: string;
  areaDesignada: string;

  _datosValores: IValoresEvento;
  _observacion: string;
  labelRemedy: string;
  cartaDiligenciada: boolean;
  contenidoCarta: string;

  _disabledForm: boolean;
  datosFlujo: any;

  dataInitGestionPendientePor: any;
  subEstados: any[];

  constructor(
    private readonly formBuiler: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) {
    super();
    this.faseFlujo = MIM_PARAMETROS.MIM_FASE_FLUJO.RADICACION;
    this.conceptoFlujo = MIM_PARAMETROS.MIM_CONCEPTO_TAREA_FLUJO.PROCESO_MEDICAMENTOS_RADICACION_DESFAVORABLE;
    this.tipoFaseFlujo = GENERALES.TIPO_FASE_FLUJO.RADICACION;
    this._disabledForm = true;
    this.mostrarBitacora = true;
    this.conceptoOtrasAreas = false;
    this.peticionSegundaVez = false;
  }

  ngOnInit() {
    this._subs.push(this.route.parent.params.subscribe((params) => {
      this.asoNumInt = params.asoNumInt;
    }));

    this._subs.push(this.route.params.subscribe((params) => {
      this.idProceso = params.idProceso;
      this.idTarea = params.idTarea || null;
      this._getData();
    }));

    this.translate.get('eventos.consulta.solicitud.numeroRemedy').subscribe((text: string) => {
      this.labelRemedy = text;
    });

  }

  _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuiler.group({
        gestionPendientePor: this.formBuiler.group({
          subestados: [null],
          numeroRemedy: [null]
        })
      })
    );

    this.form.controls.gestionPendientePor['controls'].numeroRemedy.disable();
    this.changeGestionPendientePor();
  }

  private changeGestionPendientePor() {

    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    gestionPendientePor.subestados.valueChanges.subscribe(item => {
      if (item) {

        const codigoTipoGestion = item.mimTipoGestion && item.mimTipoGestion.codigo ? item.mimTipoGestion.codigo : 0;
        this.conceptoOtrasAreas = codigoTipoGestion === GENERALES.TIPO_GESTION.CONCEPTO_OTRAS_AREAS ? true : false;
        this.guardarComentario = codigoTipoGestion === GENERALES.TIPO_GESTION.GUARDAR_COMENTARIO ? true : false;

        if (item.codigo === GENERALES.MIM_SUBESTADOS.REMEDY) {
          gestionPendientePor.numeroRemedy.setValidators([Validators.required]);
          gestionPendientePor.numeroRemedy.enable();
        } else {
          gestionPendientePor.numeroRemedy.setValidators(null);
          gestionPendientePor.numeroRemedy.setValue(null);
          gestionPendientePor.numeroRemedy.disable();
        }

      }
    });
  }

  _getData() {
    forkJoin({
      _solicitudEvento: this.backService.solicitudEvento.getSolicitudEvento(this.idProceso),
      _tarea: this.backService.proceso.getTareasPorIdProceso(this.idProceso),
      _subestados: this.backService.faseSubestado.getFasesSubestados({ codigoFaseFlujo: GENERALES.TIPO_FASE_FLUJO.RADICACION }),
    }).subscribe(items => {
      this.idTarea = items._tarea[0].taskId;
      this.solicitudEvento = items._solicitudEvento;

      this.dataInitGestionPendientePor = [{ codigo: null, nombre: 'Seleccionar' }, ...items._subestados.map(y => y.mimSubestado)];
      this._initForm();
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  _guardar() {
    this._datosValores = this.valoresEventoComponent._enviarData();

    if (this.envioCarta && !this.cartaDiligenciada) {
      this.translate.get('global.diligenciarCarta').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    if (this._datosValores != null) {
      // Guarda la informacion diligenciada por el usuario
      const nombreProceso = this.solicitudEvento.mimEvento.nombreProceso;
      this.backService.solicitudEvento.postRadicar(this._getDatosFlujo(this.peticionSegundaVez), nombreProceso).subscribe(respuesta => {
        this.translate.get(respuesta.messages[0]).subscribe((mensaje: string) => {
          this._initForm();
          this.frontService.alert.success(mensaje).then(() => {
            this.router.navigate([UrlRoute.PAGES]);
          });
        });

      }, (err) => {
        if (err.error.status === 409) {
          if (!this.peticionSegundaVez) {
            this.translate.get('global.confirmacionObjecion', { mensajeObjecion: err.error.message }).subscribe((mensaje: string) => {
              this.frontService.alert.confirm(mensaje, 'danger').then((confirma: any) => {
                if (confirma) {
                  this.formValorEvento.disable();
                  this.form.disable();
                  this.envioCarta = true;
                  this.peticionSegundaVez = true;

                  this.translate.get('global.diligenciarCarta').subscribe((mensajeCarta: string) => {
                    this.frontService.alert.info(mensajeCarta);
                  });

                } else {
                  this.formValorEvento.enable();
                  this.form.enable();
                  this.envioCarta = false;
                }
              });
            });
          }
        } else {
          this.frontService.alert.error(err.error.message);
        }
      });
    }
  }

  _getDatosFlujo(confirmacion = false) {
    this.solicitudEvento.fechaEvento = this._datosValores.fechaEvento;
    this.solicitudEvento.mimFormaPago = this._datosValores.formaPago || null;
    this.solicitudEvento.descuentoSaldosVencidos = this._datosValores.saldoVencido;
    this.solicitudEvento.descuentoCuotaMes = this._datosValores.cuotaMes;
    this.solicitudEvento.oficinaGiro = this._datosValores.oficina;
    this.solicitudEvento.numeroCuentaDeposito = this._datosValores.numeroCuenta || null;
    this.solicitudEvento.valorSolicitado = this._datosValores.valorSolicitado;
    this.solicitudEvento.mimBanco = this._datosValores.banco || null;
    this.solicitudEvento.mimTipoCuentaBanco = this._datosValores.tipoCuenta || null;
    this.solicitudEvento.codigoRetencionEvento = this._datosValores.retencionEvento || null;
    this.solicitudEvento.mimTipoBeneficiarioPago = this._datosValores.pagarA;
    this.solicitudEvento.abonaCredito = this._datosValores.abonaCredito;
    this.solicitudEvento.copago = this._datosValores.copago;

    this.datosFlujo = {};
    this.datosFlujo['processInstanceId'] = this.idProceso;
    this.datosFlujo['taskId'] = this.idTarea;
    this.datosFlujo['mimSolicitudEvento'] = this.solicitudEvento;

    let datosRadicar = {};
    let comentario = GENERALES.DES_FASES_FLUJO.RADICACION + this._observacion;
    const gestionPendientePor = this.form.controls.gestionPendientePor['controls'];
    // Si se envía a concepto otras áreas
    if (this.conceptoOtrasAreas) {

      datosRadicar = {
        comment: comentario,
        otraArea: this.conceptoOtrasAreas,
        areaDesignada: gestionPendientePor.subestados.value.codigo
      };

      // Si se pasa a la fase de radicación
    } else {

      if (this.guardarComentario) {
        if (gestionPendientePor.numeroRemedy.value) {
          const comnentarioRemedy = [this.labelRemedy, gestionPendientePor.numeroRemedy.value, comentario];
          comentario = comnentarioRemedy.join(' ');
        }

        datosRadicar = {
          type: GENERALES.TIPO_COMENTARIO.GESTION,
          message: comentario
        };

      } else {
        datosRadicar = {
          comment: comentario,
          otraArea: this.conceptoOtrasAreas,
          confirmacion: confirmacion,
          contenidoCarta: this.contenidoCarta
        };
      }
    }

    this.datosFlujo['variables'] = datosRadicar;
    return this.datosFlujo;
  }

  cartaGenerada(event) {
    this.cartaDiligenciada = true;
    this.contenidoCarta = event;
  }

  datoObservacion(event) {
    this._observacion = event;
    if (this._observacion != null) {
      this._disabledForm = false;
    }
  }

  gestionar() {
    this.mostrarBitacora = !this.mostrarBitacora;
  }

  ngOnDestroy() {
    this._subs.forEach(x => x.unsubscribe());
  }

  public onFormGroupChangeEvent(formData) {
    this.formValorEvento = formData;
  }

  hasChanges(): Observable<boolean> | Promise<boolean> | boolean {
    return this.form && this.form.dirty && !this.isPristine(this.form);
  }

}
