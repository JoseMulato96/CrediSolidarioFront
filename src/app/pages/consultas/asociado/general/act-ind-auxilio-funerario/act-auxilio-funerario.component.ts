import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { FormValidate } from '@shared/util';
import { masksPatterns } from '@shared/util/masks.util';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '@core/store/data.service';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DatosAsociado } from '@shared/models';
import { Acciones } from '@core/store/acciones';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-act-auxilio-funerario',
  templateUrl: './act-auxilio-funerario.component.html',
})
export class ActAuxFunerarioComponent extends FormValidate implements OnInit, OnDestroy {

  shownPanelAgregarComentarios = false;
  form: FormGroup;
  isForm: Promise<any>;
  indicadores: any[];
  _asoNumInt = '';
  asociado: DatosAsociado;
  _subs: Subscription[] = [];

  campo: string;
  disabled: boolean;
  asociadoService: any;
  patterns = masksPatterns;
  indicadorIncial: any;
  estadosBeneficiarios: any[];
  menuConsultaAuxFunerario: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this._subs.push(this.route.parent.parent.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this._subs.push(this.dataService.asociados().asociado
          .subscribe((respuesta: DatosAsociadoWrapper) => {
            if (!respuesta ||
              respuesta.datosAsociado.numInt !== this._asoNumInt) {
              return;
            }

            this.asociado = respuesta.datosAsociado;

            this.backService.parametro.getParametrosTipo(
              SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.TIPO_COD
            ).subscribe((responseIndicadores: any) => {
              this.indicadores = responseIndicadores.sipParametrosList;
              this.indicadorIncial = this._getIndicador(this.asociado.desAuxFun);
              this._initFormGroup(this.indicadorIncial);

              this.form.controls.indicador.setValue(this.indicadorIncial);

            });
          }, (err) => {
            this.frontService.alert.warning(err.error.message);
          }));
      }
    ));

    // Obtenemos el menu de la pagina para procesa permisos.
    this.menuConsultaAuxFunerario = this.frontService.scope.obtenerMenu([
      'MM_CONSULTA',
      'MM_FLOTANTE_CONSULTA_ASOCIADO',
      'MM_CONSUL_ASOC_GENERAL',
      'MM_CONSUL_ASOC_GENERAL_IND_AUXFUN',
      'MM_EDITAR'], false);
  }

  ngOnDestroy() {
    this._subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * @description Inicializa el form group.
   *
   */
  _initFormGroup(indicadorIncial: any) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        indicador: new FormControl(null, [Validators.required]),
        observacion: new FormControl(null, [Validators.required, Validators.maxLength(2000)])
      }));

    this.onChanges(indicadorIncial);
  }

  onChanges(indicadorIncial: any) {
    this.disabled = indicadorIncial &&
      (indicadorIncial.sipParametrosPK.codigo === SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.SIP_INDICADORES.CREDITO_T70
        || indicadorIncial.sipParametrosPK.codigo === SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.SIP_INDICADORES.CUOTA_UNICA);

    // Deshabilitamos los campos del formulario.
    if (this.disabled) {
      this.translate.get('asociado.general.renunciaAuxilioFunerario.validacionCambioIndicador').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      this.form.controls.observacion.disable({ onlySelf: true });
      this.form.controls.indicador.disable({ onlySelf: true });
    }

  }

  _onLimpiar() {
    this.form.reset();
    this.form.controls.indicador.setValue('');
    this._initFormGroup(null);
  }

  onActualizar(): boolean {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    this.actualizarIndicador();
  }

  actualizarIndicador() {
    const params: any = {
      codigoIndicador: this.form.controls.indicador.value.sipParametrosPK.codigo,
      observacion: this.form.controls.observacion.value.trim(),
      descripcionIndicador: this.form.controls.indicador.value.nombre,
      estadoNovedad: SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.SIP_PARAMETROS.ESTADO_NOVEDAD,
      codProAuxFun: SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.SIP_PARAMETROS.COD_AUXILIO_FUNERARIO,
      renuncia: SIP_PARAMETROS_TIPO.TIPO_INDICADOR_AUX_FUNERARIO.SIP_PARAMETROS.COD_RENUNCIA
    };

    params.asoNumInt = this._asoNumInt;
    this.backService.auxilioFunerario.sendUpdateIndicadorFunerario(params).subscribe((indicador: any) => {
      this.translate.get('global.actualizacionExitosaMensaje').subscribe((text: string) => {
        this.frontService.alert.success(text);
      });
      this.dataService.asociados().accion(Acciones.Publicar, this._asoNumInt, true);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
  * @description Obtiene un indicador.
  * @param nombre Codigo de indicador.
  */
  _getIndicador(nombre: any) {
    let selected: any;
    this.indicadores.forEach((indicador: any) => {
      if (indicador.nombre === nombre) {
        selected = indicador;
      }
    });

    return selected;
  }

  tienePermisos(permiso: string) {
    return this.frontService.scope.tienePermisos(permiso, this.menuConsultaAuxFunerario ?
      this.menuConsultaAuxFunerario.appObject.operations : []);
  }

}
