import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IPulldownCorteFiltro } from '@shared/interfaces/i-pulldown-filtro';
import { masksPatterns } from '@shared/util/masks.util';
import { FormValidate } from '@shared/util';
import { SIP_PARAMETROS_TIPO } from '@shared/static/constantes/sip-parametros-tipo';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';
@Component({
  selector: 'app-mim-search-asociado',
  templateUrl: './mim-search-asociado.component.html',
  styleUrls: ['./mim-search-asociado.component.css']
})
export class MimSearchAsociadoComponent extends FormValidate implements OnInit {

  _autocompleteTipoDocumentos: IPulldownCorteFiltro[] = [];
  tipos: any[];

  _cssShow = false;

  form: FormGroup;
  isForm: Promise<any>;

  patterns = masksPatterns;

  @Input()
  // tslint:disable-next-line:no-use-before-declare
  configuracion: MimSearchAsociadoConfiguracion = new MimSearchAsociadoConfiguracion();

  @Output()
  asociado: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  limpiar: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService,
    private readonly formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    if (this.configuracion) {
      this.configuracion.component = this;
    }

    this.getTiposIdentificacion();
    this._initFormGroup();
  }

  limpiarBusqueda() {
    this.form.controls.formNombres.reset();
    this.form.controls.formRegional.reset();
    this.form.controls.formEstado.reset();

    this.limpiar.emit();
  }

  public onLimpiar() {
    this.form.reset();
    this._initFormGroup();

    this.limpiar.emit();
  }

  onKeydown() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((mensaje: string) => {
        this.frontService.alert.error(mensaje);
      });
      return;
    }

    const id = this.form.get('formNumeroCedula').value;
    let tipoId = 0;

    if (this.form.get('tipoId') !== null && this.form.get('tipoId').value !== null
      && this.form.get('tipoId').value.sipParametrosPK !== null) {
      tipoId = this.form.get('tipoId').value.sipParametrosPK.codigo;
    }

    if (id !== null && id !== undefined && tipoId !== undefined && tipoId !== 0) {
      this.backService.asociado.buscarAsociado({
        nitCli: id,
        tipDoc: tipoId,
        isPaged: true,
        page: 0,
        size: 1
      }).subscribe(
        (respuesta: any) => {

          if (!respuesta.content && !respuesta.content.length) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.frontService.alert.info(response);
              });
            return;
          }

          // Seteo de datos
          const asociado = respuesta.content[0];
          this.form.controls.formNombres.setValue(asociado.nomCli);
          this.form.controls.formEstado.setValue(asociado.desEstado);
          this.form.controls.formRegional.setValue(asociado.regionalAso);

          // Emitimos la salida... Hemos encontrados datos para el tipo y la identificacion ingresadas.
          this.asociado.emit(asociado);
        },
        (err: any) => {
          if (err.status === 404) {
            this.translate
              .get('asociado.noSeEncontraronRegistrosMensaje')
              .subscribe((response: string) => {
                this.frontService.alert.info(response);
              });
            return;
          }
        }
      );
    }
  }

  _initFormGroup(previous?: boolean) {
    this.isForm = Promise.resolve(
      this.form = this.formBuilder.group({
        formNumeroCedula: new FormControl(previous ? this.form.controls.formNumeroCedula : null, Validators.required),
        tipoId: new FormControl(previous ? this.form.controls.numeroCedula : null, Validators.required),
        formNombres: new FormControl(previous ? this.form.controls.formNombres : null),
        formEstado: new FormControl(previous ? this.form.controls.formEstado : null),
        formRegional: new FormControl(previous ? this.form.controls.formRegional : null),
      })
    );
    this.disabled();

    this.onChanges();
  }

  disabled() {
    this.form.controls['formNombres'].disable();
    this.form.controls['formEstado'].disable();
    this.form.controls['formRegional'].disable();
  }

  getTiposIdentificacion() {
    this.backService.parametro.getParametrosTipo(
      SIP_PARAMETROS_TIPO.TIPOS_IDENTIFICACION.TIP_COD
    ).subscribe((responseIndicadores: any) => {
      this.tipos = responseIndicadores.sipParametrosList;
    });
  }

  onChanges() {
    this.form.controls.tipoId.valueChanges.subscribe(tipoId => {
      this.limpiarBusqueda();
    });

    this.form.controls.formNumeroCedula.valueChanges.subscribe(formNumeroCedula => {
      this.limpiarBusqueda();
    });
  }
}

export class MimSearchAsociadoConfiguracion {
  component?: MimSearchAsociadoComponent;
}
