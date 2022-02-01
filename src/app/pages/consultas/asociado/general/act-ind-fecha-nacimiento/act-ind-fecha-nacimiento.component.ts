import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { FormValidate } from '@shared/util';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DataService } from '@core/store/data.service';
import { Acciones } from '@core/store/acciones';
import { DatosAsociadoWrapper } from '@core/store/asociado-data.service';
import { DatosAsociado } from '@shared/models';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-act-ind-fecha-nacimiento',
  templateUrl: './act-ind-fecha-nacimiento.component.html'
})
export class ActIndFechaNacimientoComponent extends FormValidate
  implements OnInit, OnDestroy {
  _asoNumInt: string;
  _asoSubscription: Subscription;
  asociado: DatosAsociado;
  asociadoSubscription: Subscription;
  form: FormGroup;
  isForm: Promise<any>;
  indicadores: any[];
  subseries: any[];
  mostrarSubserie = true;
  menuConsultaFechaNacimiento: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly dataService: DataService,
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService) {
    super();
  }

  ngOnInit() {
    this._asoSubscription = this.route.parent.parent.parent.parent.params.subscribe(
      params => {
        this._asoNumInt = params['asoNumInt'];
        if (!this._asoNumInt) {
          return;
        }

        this.asociadoSubscription = this.dataService.asociados().asociado
          .subscribe((respuesta: DatosAsociadoWrapper) => {
            if (!respuesta ||
              respuesta.datosAsociado.numInt !== this._asoNumInt) {
              return;
            }

            this.asociado = respuesta.datosAsociado;

            const responseIndicador = this.backService.parametro.getParametrosTipo(
              SIP_PARAMETROS_TIPO.TIPO_INDICADOR_FECHA_NACIMIENTO.TIP_COD
            );
            const responseSubserie = this.backService.parametro.getParametrosTipo(
              SIP_PARAMETROS_TIPO.TIPO_SUBSERIE_INDICADOR_FECHA_NACIMIENTO.TIP_COD
            );

            forkJoin([responseIndicador, responseSubserie])
              .subscribe(([responseIndicadores, resposeSubseries]) => {
                this.indicadores = responseIndicadores.sipParametrosList;
                this.subseries = resposeSubseries.sipParametrosList;
                this._initFormGroup();
                this.form.controls.indicador.setValue(
                  this._getIndicador(Number(this.asociado.vinIndFechaNacimiento))
                );
              }, (err) => {
                this.frontService.alert.warning(err.error.message);
              });
          });
      }
    );

    // Obtenemos el menu de la pagina para procesa permisos.
    this.menuConsultaFechaNacimiento = this.frontService.scope.obtenerMenu([
      'MM_CONSULTA',
      'MM_FLOTANTE_CONSULTA_ASOCIADO',
      'MM_CONSUL_ASOC_GENERAL',
      'MM_CONSUL_ASOC_GENERAL_IND_FECH_NACIMI',
      'MM_EDITAR', 'MM_CONSULTA'], false);
  }

  /**
   * @description Obtiene un indicador.
   * @param codigoIndicador Codigo de indicador.
   */
  _getIndicador(codigoIndicador: number) {
    let selected: any;
    this.indicadores.forEach((indicador: any) => {
      if (indicador.valor === codigoIndicador) {
        selected = indicador;
      }
    });

    return selected;
  }

  ngOnDestroy() {
    if (this._asoSubscription) {
      this._asoSubscription.unsubscribe();
    }
    if (this.asociadoSubscription) {
      this.asociadoSubscription.unsubscribe();
    }
  }

  _onActualizar() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((text: string) => {
        this.frontService.alert.warning(text);
      });
      return;
    }

    const request: any = {};
    request.codigoIndicador = this.form.value.indicador.valor;
    request.codigoSubSerie = this.form.value.subserie ? this.form.value.subserie.valor : null;

    if (this.asociado.vinIndFechaNacimiento && request.codigoIndicador ===
      this.asociado.vinIndFechaNacimiento) {
      this.translate
        .get('asociado.general.actualizaIndicadorFNacimiento.indicadorIgual')
        .subscribe((text: string) => {
          this.frontService.alert.warning(text);
        });
      return;
    }

    request['asoNumInt'] = this._asoNumInt;
    this.backService.fechaNacimiento.actualizarIndicadorFechaNacimiento(request).subscribe(response => {

      this.translate.get('global.actualizacionExitosaMensaje')
        .subscribe((text: string) => {
          this.frontService.alert.success(text);
        });
      this.dataService.asociados().accion(Acciones.Publicar, this._asoNumInt, true);
    }, (err: any) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
   * @description Inicializa el form group.
   *
   */
  _initFormGroup() {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        indicador: new FormControl(null, [Validators.required]),
        subserie: new FormControl(null, [Validators.required])
      }));

    this.onChanges();
  }

  onChanges() {
    this.form.controls.indicador.valueChanges.subscribe(indicador => {
      this.mostrarSubserie = indicador && indicador.valor ===
        SIP_PARAMETROS_TIPO.TIPO_INDICADOR_FECHA_NACIMIENTO.SIP_PARAMETROS.FEC_NAC_CORRECTA_VALIDA;
      if (this.mostrarSubserie) {
        this.form.controls.subserie.enable();
        this.form.controls.subserie.reset();
      } else {
        this.form.controls.subserie.disable();
      }
    });
  }

  _onLimpiar() {
    this.form.reset();
    this._initFormGroup();
  }

  tienePermisos(permiso: string) {
    return this.frontService.scope.tienePermisos(permiso, this.menuConsultaFechaNacimiento ?
      this.menuConsultaFechaNacimiento.appObject.operations : []);
  }
}
