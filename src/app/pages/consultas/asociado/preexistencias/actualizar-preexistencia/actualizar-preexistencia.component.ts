import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlRoute } from '@shared/static/urls/url-route';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { FormValidate } from '@shared/util';
import { DateUtil } from '@shared/util/date.util';
import { TranslateService } from '@ngx-translate/core';
import { EventoAsociadosService } from '../../services/evento-asociados.service';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-actualizar-preexistencia',
  templateUrl: './actualizar-preexistencia.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ActualizarPreexistenciaComponent extends FormValidate
  implements OnInit, OnDestroy {
  _asoNumInt: string;
  _asoSubscription: Subscription;
  asociado: any;
  asociadoSubscription: Subscription;
  _preCod: any;
  _preCodSubscription: Subscription;

  preexistencia: any;
  empleado: any;
  causas: any[];
  examenes: any[];
  estados: any[];

  form: FormGroup;
  isForm: Promise<any>;

  maxDateValue: any;
  minDateValue: any;

  menuConsultaPreexistencias: any;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly eventoAsociado: EventoAsociadosService,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this._asoSubscription = this.route.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.asociadoSubscription = this.dataService
          .asociados()
          .asociado.subscribe((respuesta: DatosAsociadoWrapper) => {
            if (
              !respuesta ||
              respuesta.datosAsociado.numInt !== this._asoNumInt
            ) {
              return;
            }

            // Inicializa datos del asociado.
            this.asociado = respuesta.datosAsociado;

            // Calcula fecha minima y  fecha maxima.
            this.minDateValue = new Date(this.asociado.fecNac);
            this.maxDateValue = new Date();

            this._preCodSubscription = this.route.params.subscribe(
              preParams => {
                this._preCod = preParams['preCod'];
                if (!this._preCod) {
                  return;
                }

                this.getPreexistencia();
              }
            );
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          });

        this.eventoAsociado.atras().next({
          mostrar: true,
          url: [
            UrlRoute.PAGES,
            UrlRoute.CONSULTAS,
            UrlRoute.CONSULTAS_ASOCIADO,
            this._asoNumInt,
            UrlRoute.PREEXISTENCIAS
          ]
        });
        this.eventoAsociado.summenu().next({ mostrar: false });
      }
    );

    // Obtenemos el menu de la pagina para procesa permisos.
    this.menuConsultaPreexistencias = this.frontService.scope.obtenerMenu([
      'MM_CONSULTA',
      'MM_FLOTANTE_CONSULTA_ASOCIADO',
      'MM_CONSUL_ASOC_PREEXISTENCIAS'], false);
  }

  ngOnDestroy() {
    if (this._asoSubscription) {
      this._asoSubscription.unsubscribe();
      this._asoSubscription = undefined;
    }

    if (this._preCodSubscription) {
      this._preCodSubscription.unsubscribe();
      this._preCodSubscription = undefined;
    }

    if (this.asociadoSubscription) {
      this.asociadoSubscription.unsubscribe();
      this.asociadoSubscription = undefined;
    }
  }

  /**
   * @description Inicializa el formulario de creaci;ón de preexistencia
   *
   */
  private _initForm() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        fechaRegistro: new FormControl(this.preexistencia.preFechaRegistro, [Validators.required]),
        fechaInicio: new FormControl(this.preexistencia.preFechaInicio, [Validators.required]),
        causa: new FormControl(this.getCausa(Number(this.preexistencia.preCausa)), [Validators.required]),
        estado: new FormControl(this.getEstado(Number(this.preexistencia.preEstadoPreexistencia)), [Validators.required]),
        examen: new FormControl(this.getExamen(Number(this.preexistencia.preExamen)), [Validators.required]),
        calificacion: new FormControl(this.preexistencia.prePuntaje, [Validators.required]),
        cobertura: new FormControl(this.preexistencia.preCobertura === String(SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.SIP_PARAMETROS.SI)),
        observaciones: new FormControl(this.preexistencia.preDesc, [Validators.required, Validators.maxLength(2000)])
      }));
  }

  /**
   * @description Lanzado al guardar una preexistencia.
   *
   */
  _onSavePreexistencia() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const _preexistencia = this.preexistencia;
    _preexistencia.asoNumInt = this._asoNumInt;
    _preexistencia.preFechaInicio = typeof this.form.controls.fechaInicio.value === 'string' || this.form.controls.fechaInicio.value instanceof String ?
      this.form.controls.fechaInicio.value :
      DateUtil.dateToString(this.form.controls.fechaInicio.value, GENERALES.FECHA_PATTERN);
    _preexistencia.preCausa = String(this.form.controls.causa.value.sipParametrosPK.codigo);
    _preexistencia.preExamen = String(this.form.controls.examen.value.sipParametrosPK.codigo);
    _preexistencia.prePuntaje = this.form.controls.calificacion.value;
    _preexistencia.preCobertura = String(this.form.controls.cobertura.value
      ? SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.SIP_PARAMETROS.SI
      : SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.SIP_PARAMETROS.NO);
    _preexistencia.preDesc = this.form.controls.observaciones.value;
    _preexistencia.preEstadoPreexistencia = String(
      this.form.controls.estado.value.sipParametrosPK.codigo
    );

    this.backService.preexistencia
      .actualizarPreexistencia(_preexistencia)
      .subscribe((response: any) => {
        this.preexistencia = response;

        this.translate
          .get('global.actualizacionExitosaMensaje')
          .subscribe((text: string) => {
            this.frontService.alert.success(text).then(x => {
              this.eventoAsociado.summenu().next({ mostrar: true });
              this.eventoAsociado.atras().next({ mostrar: false });
              this.router.navigate([
                UrlRoute.PAGES,
                UrlRoute.CONSULTAS,
                UrlRoute.CONSULTAS_ASOCIADO,
                this._asoNumInt,
                UrlRoute.PREEXISTENCIAS
              ]);
            });
          });
      }, (err) => {
        this.frontService.alert.warning(err.error.message);
      });
  }

  private getPreexistencia() {
    this.backService.preexistencia
      .getPreexistencia({
        asoNumInt: this._asoNumInt,
        preCod: this._preCod
      })
      .subscribe(
        (response: any) => {
          this.preexistencia = response;

          // El servicio nos devuelve los datos del empleado en preexistencia.empleado;
          // sin embargo debemos mostrar el id - nombre.
          if (this.preexistencia.empleado) {
            this.preexistencia.empleadoNombre = (this.preexistencia.empleado.idString || this.preexistencia.empleado.id)
              + ' - ' + this.preexistencia.empleado.name;
          } else {
            this.preexistencia.empleadoNombre = this.preexistencia.usuario;
          }

          this.obtenerParametros();
        },
        (err: any) => {
          this.router.navigate([UrlRoute.PAGES, '**']);
        }
      );
  }

  /**
   * @description Obtiene parametros necesarios para la vista.
   *
   */
  private obtenerParametros() {
    forkJoin([
      this.backService.parametro.getParametrosTipo(
        SIP_PARAMETROS_TIPO.TIPO_CAUSAS_PREEXISTENCIAS.TIP_COD
      ),
      this.backService.parametro.getParametrosTipo(
        SIP_PARAMETROS_TIPO.TIPO_AFIRMACIONES.TIP_COD
      ),
      this.backService.parametro.getParametrosTipo(
        SIP_PARAMETROS_TIPO.TIPO_ESTADOS_PREEXISTENCIAS.TIP_COD
      )
    ]).subscribe(([causas, examenes, estados]) => {
      this.causas = causas.sipParametrosList;
      this.examenes = examenes.sipParametrosList;
      this.estados = estados.sipParametrosList;

      // Inicializamos el formulario.
      this._initForm();
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }
  /**
   * @description Obtiene una causa a partir de su codigo.
   *
   * @param causaCod Codigo de la causa.
   */
  private getCausa(causaCod: any) {
    let selected;
    this.causas.forEach((causa: any) => {
      if (causa.sipParametrosPK.codigo === causaCod) {
        selected = causa;
      }
    });

    return selected;
  }

  /**
   * @description Obtiene un estado a partir de su codigo.
   *
   * @param estadoCod Codigo de estado de preexistencia.
   */
  private getEstado(estadoCod: any) {
    let selected;
    this.estados.forEach((estado: any) => {
      if (estado.sipParametrosPK.codigo === estadoCod) {
        selected = estado;
      }
    });

    return selected;
  }

  /**
   * @description Obtiene un examen a partir de su codigo.
   *
   * @param examenCod Codigo de examen.
   */
  private getExamen(examenCod: any) {
    let selected;
    this.examenes.forEach((examen: any) => {
      if (examen.sipParametrosPK.codigo === examenCod) {
        selected = examen;
      }
    });

    return selected;
  }

  /**
   * @description Al dar click en una celda.
   *
   */
  _OnClickHistorico() {
    this.router.navigate(
      [
        UrlRoute.PAGES,
        UrlRoute.CONSULTAS,
        UrlRoute.CONSULTAS_ASOCIADO,
        this._asoNumInt,
        UrlRoute.PREEXISTENCIAS,
        this._preCod,
        UrlRoute.PREEXISTENCIAS_HISTORICO
      ],
      {
        queryParams: {
          diagCod: this.preexistencia.diagCod.diagCod
        }
      }
    );
  }

  /**
   * @description Controla rango de numberos en la calificacion.
   *
   */
  _onKeyUp() {
    if (this.form.controls.calificacion.value < 0) {
      this.form.controls.calificacion.setValue(0);
    } else if (this.form.controls.calificacion.value > 8) {
      this.form.controls.calificacion.setValue(8);
    }
  }

  tienePermisos(permiso: string) {
    return this.frontService.scope.tienePermisos(permiso, this.menuConsultaPreexistencias ?
      this.menuConsultaPreexistencias.appObject.operations : []);
  }
}
